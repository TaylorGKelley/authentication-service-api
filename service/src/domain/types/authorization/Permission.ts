type Permission = {
  id: number;
  name: string;
  assignToNewRole?: boolean;
  linkedServiceId: number;
};

export default Permission;
