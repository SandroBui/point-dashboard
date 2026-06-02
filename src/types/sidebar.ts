export type NavItem = {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

export type NavGroup = {
    title: string;
    items: NavItem[];
};