/** Whether a given section type may appear more than once in an invitation.
 *  `type` is a bare string here (not DOS's `SectionType`) — the domain layer
 *  stays free of the design-system import; the presentation layer matches it
 *  against `SectionType` when it needs the literal union. */
export interface SectionCardinalityRule {
  readonly type: string;
  readonly singleton: boolean;
}
