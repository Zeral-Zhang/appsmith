export type OrgRole = {
  id: string;
  name: string;
  displayName?: string;
  isDefault?: boolean;
};

export type Org = {
  id: string;
  name: string;
  website?: string;
};
