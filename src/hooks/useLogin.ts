import { useReducer, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { LoginReponse } from "../interfaces/pandoraApiResponse";
import { cachasApi } from "../api/cachasApi";
import { useApiUrl } from "./useApiUrl";
import { apiUrlValida, normalizarApiUrl } from "../config/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface UseLogin {
  isLoading: boolean;
  error: string;
  state: LoginData;
  servidor: string;
  setServidor: ( value: string ) => void;
  handleLogin: () => void;
  handleInputChange: ( fieldName: keyof LoginData, value: string ) => void;
  request: LoginReponse;
}

export const useLogin = (): UseLogin => {

  const initialState: LoginData = {
    email: '',
    password: ''
  }

  type Action = { type: 'handleInputChange', payload: { fieldName: keyof LoginData, value: string } };

  const dataReducer = ( state: LoginData, action: Action ) => {
    switch( action.type ){
      case 'handleInputChange':
        return {
          ...state,
          [ action.payload.fieldName ] : action.payload.value
      }
    }
  }

  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string>('');
  const [ state, dispatch ] = useReducer( dataReducer, initialState );
  const [ request, setRequest ] = useState<LoginReponse>({} as LoginReponse);
  const { singIn, changeUsername, changeAvatar } = useContext( AuthContext );

  // La IP la escribe el usuario cada vez: el campo siempre empieza vacío.
  // Los demás hooks (useTareaApi, useUserApi, etc.) la leen con useApiUrl.
  const { guardarApiUrl } = useApiUrl();
  const [ servidor, setServidor ] = useState<string>('');

  const handleInputChange = ( fieldName: keyof LoginData, value: string ) => {
    dispatch({ type: 'handleInputChange', payload: { fieldName, value } });
  }

  const handleLogin = async () => {
    setError('');

    if (!servidor.trim()) {
      setError('Escribe la dirección IP del servidor.');
      return;
    }
    if (!apiUrlValida(servidor)) {
      setError('La dirección no es válida. Ejemplo: 192.168.1.15 o 192.168.1.15:3000');
      return;
    }
    if (!state.email.trim() || !state.password) {
      setError('Escribe tu correo y tu contraseña.');
      return;
    }

    const url = normalizarApiUrl( servidor );
    setServidor( url );
    setIsLoading(true);

    try {
      const response = await cachasApi.post<LoginReponse>(
        `${url}/users/login`,
        { email: state.email, password: state.password },
        { timeout: 8000 }
      );

      setRequest( response.data );

      if (!response.data) {
        setError('Correo o contraseña incorrectos.');
        return;
      }

      // Login correcto: ahora sí se guarda la IP y se avisa a todos los hooks
      await guardarApiUrl( url );

      singIn();
      response.data.username && changeUsername(response.data.username);
      response.data.imagen && changeAvatar(response.data.imagen);
    } catch (e: any) {
      const status = e?.response?.status;
      if (!e?.response) {
        setError(`No se pudo conectar con ${url}. Revisa la IP, que el servidor esté encendido y que estés en la misma red.`);
      } else if (status === 400 || status === 401 || status === 403) {
        setError('Correo o contraseña incorrectos.');
      } else {
        setError(`El servidor respondió con error ${status}. Revisa que la dirección sea la de la API.`);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, state, servidor, setServidor, handleLogin, handleInputChange, request };

}