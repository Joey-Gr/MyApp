import React, { Component, useEffect, useState } from 'react'
import { View, Image, StyleSheet, Text, Linking } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'

interface HomeProps {
    navigation: any;
    bookingReducer: BookingState;
    userReducer: UserState;
    getBlockRessource: Function;
    getCustomerBookings: Function,
    getProfessionalBookings: Function;
    getNextBookingAvatar: Function;
    getCurrentContest: Function;
}

export const _HomeScreen: React.FC<HomeProps> = (props) => {
    const { bookings } = props.bookingReducer;
    const { publicity, articleText, articleLink } = props.userReducer;
    const [nextBooking, setNextBooking] = useState<BookingModel>(undefined);
    const [user, setUser] = useState<string>(undefined)

    const isFocused = useIsFocused();

    useEffect(() => {
        async function getRessource() {
            const user = await storage.load({ key: 'currentUser', autoSync: true, syncInBackground: true });
            setUser(user);
            await props.getBlockRessource(1, "PUBLICITE")
            await props.getBlockRessource(2, "ARTICLETEXTE")
            await props.getBlockRessource(3, "ARTICLELIEN")
            //await props.getCurrentContest()
        }
        if (isFocused) {
            getRessource()
        }
    }, [isFocused])

    useEffect(() => {
        async function getRessource() {
            const user = await storage.load({ key: 'currentUser', autoSync: true, syncInBackground: true });
            user.user.details.userKind === "CUSTOMER" ?
                await props.getCustomerBookings(user.user.details.businessUserId) :
                await props.getProfessionalBookings(user.user.details.businessUserId)
        }
        getRessource()
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
                {//<SearchBar navigation={props.navigation} />
                }
                {bookings && bookings.length > 0 && bookings.sort((a, b) =>
                    Date.parse(moment(a.startDate).toString()) - Date.parse(moment(b.startDate).toString())).filter(booking =>
                        moment(booking.startDate) >= moment() && booking.status === "SCHEDULED")[0] ?
                    <Booking navigation={props.navigation} booking={bookings.sort((a, b) =>
                        Date.parse(moment(a.startDate).toString()) - Date.parse(moment(b.startDate).toString())).filter(booking =>
                            moment(booking.startDate) >= moment() && booking.status === "SCHEDULED")[0]}
                    />
                    :
                    <View>
                        <View style={{ alignItems: "center", borderBottomWidth: 2, borderBottomColor: colors.lightGrey, marginVertical: 20, marginHorizontal: 50 }} />
                        <View style={{ justifyContent: "center", alignItems: "baseline", flexDirection: "row" }}>
                            <Image source={require('../assets/images/user/agenda.png')} style={{ width: 30, height: 30, marginHorizontal: 5 }} ></Image>
                            <Text style={{ alignSelf: "center", fontSize: 18, paddingBottom: 10, color: colors.orange, marginHorizontal: 5 }}>Aucun rendez-vous prévu</Text>
                        </View>
                        <View style={{ alignItems: "center", borderBottomWidth: 2, borderBottomColor: colors.lightGrey, marginTop: 20, marginHorizontal: 50 }} />
                    </View>}
                {user && (user as any).user.details.userKind === "BUSINESS" &&
                    <View>
                        <Text style={{ fontSize: 26, textAlign: "center" }}>ACTUALITE</Text>
                        <Text style={{ fontSize: 16, textAlign: "center", paddingVertical: 5 }}>
                            {articleText != "" ? base64.decode(articleText) : "Aide pour les entreprise face au Covid-19"}
                        </Text>

                        <TouchableOpacity style={styles.more} onPress={() => { articleLink != "" ? Linking.openURL(base64.decode(articleLink)) : {} }}>
                            <Text style={{ color: colors.white, fontSize: 18, textAlignVertical: "center", fontWeight: "bold" }}>
                                EN SAVOIR PLUS
                            </Text>
                        </TouchableOpacity>
                    </View>}
                {user && (user as any).user.details.userKind === "CUSTOMER" &&
                    <View style={{ alignItems: "center", paddingVertical: 10 }}
                        onTouchEnd={async () => publicity && await analytics().logEvent('my_custom_event', {
                            id: 101,
                            item: 'My Product Name',
                            description: ['My Product Desc 1', 'My Product Desc 2'],
                        })}>
                        {publicity ?
                            <Image source={{ uri: `data:image/gif;base64,${publicity}` }} style={styles.publicity} resizeMode="contain" />
                            :
                            <Image source={require('../assets/images/diverse/download.png')} style={styles.icon} resizeMode="contain" />}
                    </View>}
                <View style={{ alignItems: "center", borderBottomWidth: 2, borderBottomColor: colors.lightGrey, marginBottom: 20, marginHorizontal: 50 }} />
                <Text style={{ fontSize: 26, textAlign: "center" }}>COMMUNAUTE</Text>
                <EpikiaVideoPlayer />
                <Text style={styles.title}>Nouveaux membres de l'Epike</Text>
                <View style={styles.ProfileUserContainer}>
                    <Image source={require('../assets/images/user/users.png')} style={styles.ProfileUserIcon} ></Image>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>nom</Text>
                </View>
                <Contest />
                <FollowUs />
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
    },
    publicity: {
        maxHeight: 200,
        minHeight: 120,
        width: "100%",
    },
    title: {
        color: colors.orange,
        fontSize: 18,
        textAlign: "center",
        fontWeight: "bold",
        paddingTop: 10
    },
    more: {
        backgroundColor: colors.orange,
        width: "80%",
        justifyContent: "center",
        borderRadius: 2,
        height: 40,
        alignSelf: "center",
        alignItems: 'center',
        margin: 10
    },
    ProfileUserIcon: {
        height: 60,
        width: 60,
        borderWidth: 1,
        borderRadius: 45,
        marginBottom: 10,
        marginHorizontal: 15,
        borderColor: colors.white,
    },
    icon: {
        height: 40,
        width: 40,
        marginBottom: 10,
        marginHorizontal: 15,
    },
    ProfileUserContainer: {
        marginTop: 10,
        width: 80,
        alignItems: "center",
    },
    logo: {
        width: 170,
        height: 100,
        alignSelf: "center",
        marginVertical: 20
    }
})

const mapToStateProps = (state: ApplicationState) => ({
    userReducer: state.userReducer,
    bookingReducer: state.bookingReducer,
})

const HomeScreen = connect(mapToStateProps, { getBlockRessource, getCurrentContest, getCustomerBookings, getProfessionalBookings })(_HomeScreen)
export default HomeScreen
