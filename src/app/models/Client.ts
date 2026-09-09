//Se que esto deberia de ir en un archivo aparte, luego lo cambio si eso
export interface Client{
  id:number;
  name: string;
  address: string;
  phone: string;
  preference: number;
  monthly: boolean;
  highlight: boolean;
  observation: string;
}