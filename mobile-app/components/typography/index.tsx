import {TextProps} from 'react-native';
import {Text} from 'react-native';
import tw from 'twrnc';
import {
    useFonts,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import React from "react";

interface BaseTypographyProps extends TextProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

interface HeaderProps extends BaseTypographyProps {
    level?: 1 | 2 | 3;
}

export const Header: React.FC<HeaderProps> = ({
    children,
    color = '#c0f175',
    className = '',
    level = 1,
    ...props
}) => {
    const fontSize = {
        1: 'text-4xl',
        2: 'text-3xl',
        3: 'text-2xl'
    }[level];

    return (
        <Text
            style={[
                tw`${fontSize} font-bold ${className}`,
                {fontFamily: 'Poppins_600SemiBold', color}
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const SubHeader: React.FC<BaseTypographyProps> = ({
    children,
    color = '#fff',
    className = '',
    ...props
}) => {
    return (
        <Text
            style={[
                tw`${className}`,
                {fontFamily: 'Poppins_500Medium', color: color}
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const Label: React.FC<BaseTypographyProps> = ({
    children,
    color = 'white',
    className = '',
    ...props
}) => {
    return (
        <Text
            style={[
                tw`mb-2 ${className}`,
                {fontFamily: 'Poppins_500Medium', color}
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const BodyText: React.FC<BaseTypographyProps> = ({
    children,
    color = 'white',
    className = '',
    ...props
}) => {
    return (
        <Text
            style={[
                tw`${className}`,
                {fontFamily: 'Poppins_400Regular', color}
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

export const ButtonText: React.FC<BaseTypographyProps> = ({
    children,
    color = 'black',
    className = '',
    ...props
}) => {
    return (
        <Text
            style={[
                tw`text-center font-semibold ${className}`,
                {fontFamily: 'Poppins_600SemiBold', color}
            ]}
            {...props}
        >
            {children}
        </Text>
    );
};

interface TypographyProviderProps {
    children: React.ReactNode;
}

export const TypographyProvider: React.FC<TypographyProviderProps> = ({children}) => {
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    return <>{children}</>;
};