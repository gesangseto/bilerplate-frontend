const generalMenu = [
  {
    _name: "CSidebarNav",
    _children: [
      {
        _name: "CSidebarNavItem",
        name: "Dashboard",
        to: "/dashboard",
        link: "/dashboard",
        icon: "",
      },
      {
        _name: "CSidebarNavDropdown",
        name: "Master",
        route: "/master",
        link: "",
        icon: "",
        items: [
          {
            _name: "CSidebarNavItem",
            name: "Customer",
            to: "/master/customer",
            link: "/master/customer",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Supplier",
            to: "/master/supplier",
            link: "/master/supplier",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Product",
            to: "/master/product",
            link: "/master/product",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Product Category",
            to: "/master/product-category",
            link: "/master/product-category",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Warehouse",
            to: "/master/warehouse",
            link: "/master/warehouse",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Packaging",
            to: "/master/packaging",
            link: "/master/packaging",
            icon: "",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "Jastip",
        route: "/jastip",
        link: "",
        icon: "cil-basket",
        items: [
          {
            _name: "CSidebarNavItem",
            name: "Item Registry",
            to: "/jastip/item-registry",
            link: "/jastip/item-registry",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Outbound Manifest",
            to: "/jastip/outbound-manifest",
            link: "/jastip/outbound-manifest",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Inbound",
            to: "/jastip/inbound",
            link: "/jastip/inbound",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Picking",
            to: "/jastip/picking",
            link: "/jastip/picking",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Item Stock",
            to: "/jastip/item-stock",
            link: "/jastip/item-stock",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Item Disposal",
            to: "/jastip/item-disposal",
            link: "/jastip/item-disposal",
            icon: "",
          },
        ],
      },
      {
        _name: "CSidebarNavDropdown",
        name: "Setting",
        route: "/setting",
        link: "",
        icon: "",
        items: [
          {
            _name: "CSidebarNavItem",
            name: "Users",
            to: "/setting/user",
            link: "/setting/user",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Roles",
            to: "/setting/role",
            link: "/setting/role",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Department",
            to: "/setting/department",
            link: "/setting/department",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Section",
            to: "/setting/section",
            link: "/setting/section",
            icon: "",
          },
          {
            _name: "CSidebarNavItem",
            name: "Workflow",
            to: "/setting/workflow",
            link: "/setting/workflow",
            icon: "",
          },
        ],
      },
    ],
  },
];

const userMenu = [
  {
    _name: "CSidebarNav",
    _children: [],
  },
];

export default userMenu;
