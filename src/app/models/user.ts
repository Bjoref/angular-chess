export interface User {
  id: string;
  name: string;
  side: 'white' | 'black';
  guid?: string;
}
