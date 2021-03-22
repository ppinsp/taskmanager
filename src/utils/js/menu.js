export default {
  menus: [
    {
      title: "User",
      to: "/user",
      icon: "mdi-account",
      roles: ["admin", "hr"],
    },
    {
      title: "Department",
      to: "/department",
      icon: "mdi-badge-account",
      roles: ["admin", "hr"],
    },
    {
      title: "Team",
      to: "/team",
      icon: "mdi-account-multiple",
      roles: ["admin", "sa"],
    },
    {
      title: "Project",
      to: "/project",
      icon: "mdi-layers-triple",
      roles: ["admin", "sa"],
    },
    {
      title: "Development",
      to: "/development",
      icon: "mdi-briefcase-account",
      roles: ["admin", "dev"],
    },
    // {
    //   title: 'Sprint Backlog',
    //   to: '',
    //   icon: 'mdi-content-duplicate'
    // },
    // {
    //   title: 'Time Report',
    //   to: '',
    //   icon: 'mdi-clock-outline'
    // }
  ],
};
