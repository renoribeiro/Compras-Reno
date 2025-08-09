import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Organization } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  organization: Organization | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  canManageUsers: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  organization: null,
  session: null,
  login: async () => ({ error: null }),
  signup: async () => ({ error: null }),
  logout: async () => {},
  isAuthenticated: false,
  loading: true,
  isSuperAdmin: false,
  isAdmin: false,
  canManageUsers: false,
});

// Função para traduzir mensagens de erro do Supabase para português
const translateAuthError = (errorMessage: string): string => {
  const translations: { [key: string]: string } = {
    "Invalid login credentials": "Credenciais de login inválidas",
    "Email not confirmed": "E-mail não confirmado. Verifique sua caixa de entrada e confirme seu e-mail.",
    "User already registered": "Usuário já cadastrado",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres",
    "Unable to validate email address: invalid format": "Formato de e-mail inválido",
    "Email address not authorized": "Endereço de e-mail não autorizado",
    "Password too weak": "Senha muito fraca",
    "Signup requires a valid password": "Cadastro requer uma senha válida",
    "Invalid email": "E-mail inválido",
    "Email already registered": "E-mail já cadastrado",
    "Too many requests": "Muitas tentativas. Tente novamente mais tarde",
    "Network error": "Erro de conexão. Verifique sua internet",
    "Authentication failed": "Falha na autenticação",
    "Session expired": "Sessão expirada. Faça login novamente",
    "Access denied": "Acesso negado",
    "Invalid token": "Token inválido",
    "Token expired": "Token expirado",
    "User not found": "Usuário não encontrado",
    "Email rate limit exceeded": "Limite de e-mails excedido. Tente novamente mais tarde",
    "SMS rate limit exceeded": "Limite de SMS excedido. Tente novamente mais tarde",
    "Captcha verification failed": "Verificação de captcha falhou",
    "Invalid verification code": "Código de verificação inválido",
    "Verification code expired": "Código de verificação expirado",
    "Phone number already registered": "Número de telefone já cadastrado",
    "Invalid phone number": "Número de telefone inválido",
    "Database connection error": "Erro de conexão com o banco de dados",
    "Internal server error": "Erro interno do servidor",
    "Service temporarily unavailable": "Serviço temporariamente indisponível",
    "Invalid refresh token": "Token de atualização inválido",
    "Refresh token expired": "Token de atualização expirado",
    "Account locked": "Conta bloqueada",
    "Account suspended": "Conta suspensa",
    "Email link is invalid or has expired": "Link do e-mail é inválido ou expirou",
    "Confirmation link is invalid or has expired": "Link de confirmação é inválido ou expirou",
    "Reset password link is invalid or has expired": "Link de redefinição de senha é inválido ou expirou",
    "Magic link is invalid or has expired": "Link mágico é inválido ou expirou",
    "Only an email address or phone number should be provided on signup": "Apenas um endereço de e-mail ou número de telefone deve ser fornecido no cadastro",
    "Signup is disabled": "Cadastro está desabilitado",
    "Password is too short": "Senha muito curta",
    "Password is too long": "Senha muito longa",
    "Password must contain at least one uppercase letter": "Senha deve conter pelo menos uma letra maiúscula",
    "Password must contain at least one lowercase letter": "Senha deve conter pelo menos uma letra minúscula",
    "Password must contain at least one number": "Senha deve conter pelo menos um número",
    "Password must contain at least one special character": "Senha deve conter pelo menos um caractere especial"
  };

  if (translations[errorMessage]) {
    return translations[errorMessage];
  }

  const lowerErrorMessage = errorMessage.toLowerCase();
  
  if (lowerErrorMessage.includes("email not confirmed") || lowerErrorMessage.includes("confirm")) {
    return "E-mail não confirmado. Verifique sua caixa de entrada e confirme seu e-mail.";
  }
  
  if (lowerErrorMessage.includes("invalid login") || lowerErrorMessage.includes("invalid credentials")) {
    return "Credenciais de login inválidas";
  }
  
  if (lowerErrorMessage.includes("already registered") || lowerErrorMessage.includes("user already exists")) {
    return "Usuário já cadastrado";
  }
  
  if (lowerErrorMessage.includes("password") && lowerErrorMessage.includes("6 characters")) {
    return "A senha deve ter pelo menos 6 caracteres";
  }
  
  if (lowerErrorMessage.includes("invalid email") || lowerErrorMessage.includes("email format")) {
    return "Formato de e-mail inválido";
  }
  
  if (lowerErrorMessage.includes("too many requests") || lowerErrorMessage.includes("rate limit")) {
    return "Muitas tentativas. Tente novamente mais tarde";
  }
  
  if (lowerErrorMessage.includes("network") || lowerErrorMessage.includes("connection")) {
    return "Erro de conexão. Verifique sua internet";
  }

  return errorMessage;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Buscar perfil do usuário com criação automática se necessário
  const fetchUserProfile = async (userId: string, userEmail?: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Profile fetch error:', error);
        // Retornar perfil básico em caso de erro para não travar
        return {
          id: userId,
          user_id: userId,
          email: userEmail || '',
          full_name: userEmail?.split('@')[0] || 'User',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      if (data) {
        return data as UserProfile;
      }

      // Se não encontrou perfil, criar um básico
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          email: userEmail || '',
          full_name: userEmail?.split('@')[0] || 'User',
          role: 'user'
        })
        .select()
        .single();

      if (createError) {
        console.error('❌ Failed to create profile:', createError);
        // Retornar perfil básico mesmo se falhar na criação
        return {
          id: userId,
          user_id: userId,
          email: userEmail || '',
          full_name: userEmail?.split('@')[0] || 'User',
          role: 'user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }

      return newProfile as UserProfile;
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      // SEMPRE retornar perfil básico em caso de erro
      return {
        id: userId,
        user_id: userId,
        email: userEmail || '',
        full_name: userEmail?.split('@')[0] || 'User',
        role: 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  };

  // Organization functionality removed

  useEffect(() => {
    let mounted = true;
    let isInitializing = false;
    let sessionCheckInterval: NodeJS.Timeout | null = null;
    
    const handleAuthChange = async (event: string, session: Session | null) => {
      if (!mounted || isInitializing) {
        return;
      }

      try {
        // Definir estados básicos primeiro
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Buscar perfil com timeout para evitar travamento
          const profilePromise = fetchUserProfile(session.user.id, session.user.email);
          const timeoutPromise = new Promise<UserProfile | null>((resolve) => {
            setTimeout(() => {
            resolve({
              id: session.user.id,
              user_id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.email?.split('@')[0] || 'User',
              role: 'user',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            }, 5000); // 5 segundos timeout
          });

          const profileData = await Promise.race([profilePromise, timeoutPromise]);
          
          if (mounted) {
            setProfile(profileData);
            
            // Organization functionality removed
          }
        } else {
          if (mounted) {
            setProfile(null);
            setOrganization(null);
          }
        }
      } catch (error) {
        console.error('❌ Error in handleAuthChange:', error);
        // Em caso de erro, definir perfil básico se há usuário
        if (session?.user && mounted) {
          setProfile({
            id: session.user.id,
            user_id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.email?.split('@')[0] || 'User',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } finally {
        // SEMPRE definir loading como false
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Função para verificar e manter a sessão ativa
    const checkAndMaintainSession = async () => {
      if (!mounted) return;
      
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao verificar sessão:', error);
          return;
        }
        
        if (currentSession) {
          // Verificar se o token está próximo do vencimento (dentro de 5 minutos)
          const expiresAt = currentSession.expires_at;
          if (expiresAt) {
            const now = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = expiresAt - now;
            
            // Se o token expira em menos de 5 minutos, tentar refresh
            if (timeUntilExpiry < 300) {
              const { data, error: refreshError } = await supabase.auth.refreshSession();
              
              if (refreshError) {
                console.error('❌ Erro ao fazer refresh da sessão:', refreshError);
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro na verificação periódica da sessão:', error);
      }
    };

    const initializeAuth = async () => {
      if (isInitializing) {
        return;
      }
      
      isInitializing = true;
      
      // Tentar múltiplas vezes se necessário
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const allKeys = Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('sb-'));
          
          const { data: { session: currentSession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error(`❌ Error getting session (tentativa ${retryCount + 1}):`, error);
            retryCount++;
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            break;
          }
          
          // Processar sessão
          if (currentSession) {
            const userData = await fetchUserProfile(currentSession.user.id, currentSession.user.email);
            setUser(currentSession.user);
            setProfile(userData);
            setSession(currentSession);
            break;
          } else {
            // Verificar se há dados no localStorage mas sessão não foi recuperada
            if (allKeys.length > 0) {
              const { data, error: refreshError } = await supabase.auth.refreshSession();
              if (!refreshError && data.session) {
                const userData = await fetchUserProfile(data.session.user.id, data.session.user.email);
                setUser(data.session.user);
                setProfile(userData);
                setSession(data.session);
                break;
              }
            }
            setUser(null);
            setProfile(null);
            setSession(null);
            break;
          }
        } catch (error) {
          console.error(`❌ Erro na inicialização (tentativa ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            setUser(null);
            setProfile(null);
            setSession(null);
          }
        }
      }
      
      // SEMPRE definir loading como false e isInitializing como false
      isInitializing = false;
      if (mounted) {
        setLoading(false);
      }
    };

    // Configurar listener de mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Usar setTimeout para evitar conflitos com a inicialização
      setTimeout(() => {
        if (!isInitializing) {
          handleAuthChange(event, session);
        }
      }, 0);
    });

    // Inicializar autenticação
    initializeAuth();

    // Configurar verificação periódica da sessão (a cada 10 minutos)
    sessionCheckInterval = setInterval(checkAndMaintainSession, 10 * 60 * 1000);

    // Verificar sessão quando a janela ganha foco
    const handleWindowFocus = () => {
      if (mounted) {
        checkAndMaintainSession();
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (sessionCheckInterval) {
        clearInterval(sessionCheckInterval);
      }
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []); // Dependências vazias para executar apenas uma vez

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        const translatedError = translateAuthError(error.message);
        toast({
          title: "Erro no login",
          description: translatedError,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });
        navigate("/dashboard");
      }

      return { error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || "Erro inesperado";
      const translatedError = translateAuthError(errorMessage);
      toast({
        title: "Erro no login",
        description: translatedError,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName.trim(),
          }
        }
      });

      if (error) {
        const translatedError = translateAuthError(error.message);
        toast({
          title: "Erro no cadastro",
          description: translatedError,
          variant: "destructive",
        });
        return { error };
      }

      if (data.user) {
        toast({
          title: "Cadastro realizado",
          description: "Verifique seu email para confirmar a conta.",
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error?.message || "Erro inesperado";
      const translatedError = translateAuthError(errorMessage);
      toast({
        title: "Erro no cadastro",
        description: translatedError,
        variant: "destructive",
      });
      return { error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        const translatedError = translateAuthError(error.message);
        toast({
          title: "Erro no logout",
          description: translatedError,
          variant: "destructive",
        });
        return;
      }

      setUser(null);
      setProfile(null);
      setOrganization(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error('Logout error:', error);
      const errorMessage = error?.message || "Erro inesperado";
      const translatedError = translateAuthError(errorMessage);
      toast({
        title: "Erro no logout",
        description: translatedError,
        variant: "destructive",
      });
    }
  };

  // Computed values for access levels
  const isSuperAdmin = profile?.role === 'super_admin';
  const isAdmin = profile?.role === 'admin';
  const canManageUsers = isSuperAdmin || isAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      organization,
      session,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading,
      isSuperAdmin,
      isAdmin,
      canManageUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);