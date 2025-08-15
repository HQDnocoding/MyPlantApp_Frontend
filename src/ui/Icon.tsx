import { icons } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { HelpCircle } from 'lucide-react-native';

const Icon: React.FC<{ name?: string; size?: number }> = ({
    name = 'HelpCircle',
    size = 40,
}) => {
    const LucideIcon = icons[name as keyof typeof icons];

    if (!LucideIcon) {
        return <HelpCircle size={size} />;
    }

    return <LucideIcon size={size} />;
};

export default Icon;
