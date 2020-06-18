const organizationList = [
  {
    organization: {
      id: "5eb2eda5ba4ce1723926cf37",
      createdBy: null,
      modifiedBy: null,
      deletedAt: null,
      userPermissions: ["read:organizations", "manage:orgApplications"],
      domain: "appsmith-another-test.com",
      name: "Another Test Organization",
      website: "appsmith.com",
      organizationSettings: null,
      plugins: [
        {
          id: null,
          createdBy: null,
          modifiedBy: null,
          deletedAt: null,
          userPermissions: [],
          pluginId: "5eb2eda5ba4ce1723926cf30",
          status: null,
          new: true,
        },
      ],
      slug: "another-test-organization",
      new: false,
    },
    applications: [
      {
        id: "5eb2eda8ba4ce1723926cf49",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications"],
        name: "ApplicationServiceTest TestApp",
        organizationId: "5eb2eda5ba4ce1723926cf37",
        pages: [
          {
            id: "5eb2eda8ba4ce1723926cf4b",
            isDefault: true,
          },
        ],
        new: false,
      },
      {
        id: "5eb2eda8ba4ce1723926cf4c",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications", "read:applications"],
        name: "NewValidUpdateApplication-Test",
        organizationId: "5eb2eda5ba4ce1723926cf37",
        pages: [
          {
            id: "5eb2eda8ba4ce1723926cf4e",
            isDefault: true,
          },
        ],
        new: false,
      },
      {
        id: "5eb2eda8ba4ce1723926cf4f",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications", "read:applications"],
        name: "validGetApplicationByName-Test",
        organizationId: "5eb2eda5ba4ce1723926cf37",
        pages: [
          {
            id: "5eb2eda8ba4ce1723926cf51",
            isDefault: true,
          },
        ],
        new: false,
      },
      {
        id: "5ebasdsadsaf",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["read:applications"],
        name: "fourth",
        organizationId: "dfsdfdcf37",
        pages: [
          {
            id: "5eb2eda8ba4ce17sdd23926cf51",
            isDefault: true,
          },
        ],
        new: false,
      },
    ],
  },
  {
    organization: {
      id: "5eb2eda5ba4ce1723926cf36",
      createdBy: null,
      modifiedBy: null,
      deletedAt: null,
      userPermissions: ["read:organizations", "manage:orgApplications"],
      domain: "appsmith-spring-test.com",
      name: "Spring Test Organization",
      website: "appsmith.com",
      organizationSettings: null,
      plugins: [
        {
          id: null,
          createdBy: null,
          modifiedBy: null,
          deletedAt: null,
          userPermissions: [],
          pluginId: "5eb2eda5ba4ce1723926cf30",
          status: null,
          new: true,
        },
      ],
      slug: "spring-test-organization",
      new: false,
    },
    applications: [
      {
        id: "5eb2eda5ba4ce1723926cf3a",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications", "read:applications"],
        name: "Another TestApplications",
        organizationId: "5eb2eda5ba4ce1723926cf36",
        pages: [
          {
            id: "5eb2eda8ba4ce17sdd23926cf51",
            isDefault: true,
          },
        ],
        new: false,
      },
      {
        id: "5eb2eda5ba4ce1723926cf38",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications", "read:applications"],
        name: "LayoutServiceTest TestApplications",
        organizationId: "5eb2eda5ba4ce1723926cf36",
        pages: null,
        new: false,
      },
      {
        id: "5eb2eda5ba4ce1723926cf39",
        createdBy: null,
        modifiedBy: null,
        deletedAt: null,
        userPermissions: ["manage:applications", "read:applications"],
        name: "TestApplications",
        organizationId: "5eb2eda5ba4ce1723926cf36",
        pages: null,
        new: false,
      },
    ],
  },
];

export default organizationList;
