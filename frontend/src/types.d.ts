type NewsletterSubscriptionProps = {
    onSubmit?: (email: string) => void;
    className?: string;
}

type MenuItems = Array<{
    id: number;
    label: string;
    href: string;
    submenu?: Array<{ id: number; label: string; href: string }>;
}>;