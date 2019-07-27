export interface Workflow {
  id: string;
  user_id: string;
  type: string;
  states: Array<string>;
  current_state: string;
}
