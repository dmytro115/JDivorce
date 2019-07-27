export class WorkflowType {
  static DIVORCE = 'DivorceWorkflow';
  static DOMESTIC_VIOLENCE = 'DomesticViolenceWorkflow';

  static DIVORCE_FRAGMENT = 'divorce';
  static DOMESTIC_VIOLENCE_FRAGMENT = 'domestic-violence';

  static fromFragment(fragment: string): string {
    return {
      [WorkflowType.DIVORCE_FRAGMENT]: WorkflowType.DIVORCE,
      [WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT]: WorkflowType.DOMESTIC_VIOLENCE
    }[fragment];
  }

  static fragments(): Array<string> {
    return [WorkflowType.DIVORCE_FRAGMENT, WorkflowType.DOMESTIC_VIOLENCE_FRAGMENT];
  }
}
