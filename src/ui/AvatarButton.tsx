import React, { memo, useState, useCallback, useEffect } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import { Appbar, Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../commons/hooks';
import { logout } from '../redux/slices/authSlice';
import { CommonActions } from '@react-navigation/native';
import { loginFaceBook, logoutFacebook } from '../commons/utils/nativeFuntion';

const AvatarButton: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();

    const { accessToken, user } = useAppSelector((state) => state.auth);

    const openMenu = useCallback(() => {
        console.log('openMenu called, current visible:', visible);
        setVisible(true);
        console.log('Menu opened - visible set to true');
    }, [visible]);

    const closeMenu = useCallback(() => {
        console.log('closeMenu called, current visible:', visible);
        setVisible(false);
        console.log('Menu closed - visible set to false');
    }, [visible]);

    const handleLogin = () => {
        closeMenu();
        navigation.navigate('Login');
    };

    const handleLogout = () => {
        dispatch(logout());
        closeMenu();
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
            })
        );
    };

    const handleLogoutFB = () => {
        loginFaceBook();
        handleLogout();
    }

    const handleProfile = () => {
        closeMenu();
        Alert.alert(
            "Thông báo",
            "Tính năng đang phát triển",
            [{ text: "OK", onPress: () => { } }],
            { cancelable: true }
        );
    };

    useEffect(() => {

        console.log("acc", accessToken);



    }, [accessToken]);

    return (
        <Menu
            key={`menu-${visible}`} // Force re-render
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={styles.menuContent}
            anchor={
                user !== null ? (
                    <Appbar.Action
                        icon={() => (
                            <Image
                                source={{ uri: user?.profilePictureUri || user?.photoURL }}
                                style={styles.avatar}
                            />
                        )}
                        onPress={openMenu}
                    />
                ) : (
                    <Appbar.Action
                        icon={() => (
                            <Image
                                source={require("../../asset/image/avatar/human.png")}
                                style={styles.avatar}
                            />
                        )}
                        onPress={openMenu}
                    />
                )
            }
        >
            {accessToken === null ? (
                <Menu.Item
                    onPress={handleLogin}
                    title="Đăng nhập"
                    titleStyle={styles.menuItemTitle}
                />
            ) : (
                <>
                    <Menu.Item
                        onPress={handleProfile}
                        title="Hồ sơ"
                        titleStyle={styles.menuItemTitle}
                    />
                    <Menu.Item
                        onPress={handleLogout}
                        title="Đăng xuất"
                        titleStyle={styles.menuItemTitle}
                    />
                    {/* <Menu.Item
                        onPress={handleLogoutFB}
                        title="Đăng xuất facebook"
                        titleStyle={styles.menuItemTitle}
                    /> */}
                </>
            )}
        </Menu>
    );
};

export default memo(AvatarButton);

const styles = StyleSheet.create({
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    menuContent: {
        backgroundColor: 'white',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        borderRadius: 8,
        minWidth: 150,
        marginTop: 8,
    },
    menuItemTitle: {
        fontSize: 14,
        color: '#333',
    },
});