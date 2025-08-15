import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../commons/hooks';
import { logout } from '../redux/slices/authSlice';

const AvatarButton: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();

    const { accessToken } = useAppSelector((state) => state.auth);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleLogin = () => {
        closeMenu();
        navigation.navigate('Login');
    };

    const handleLogout = () => {
        dispatch(logout());
        closeMenu();
    };

    const handleProfile = () => {
        closeMenu();
        navigation.navigate('Profile');
    };

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
                <TouchableOpacity onPress={openMenu}>
                    <Image
                        source={require('../../asset/image/avatar/human.png')}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            }
        >
            {!accessToken ? (
                <Menu.Item onPress={handleLogin} title="Đăng nhập" />
            ) : (
                <>
                    <Menu.Item onPress={handleProfile} title="Hồ sơ" />
                    <Menu.Item onPress={handleLogout} title="Đăng xuất" />
                </>
            )}
        </Menu>
    );
};

export default AvatarButton;

const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});
