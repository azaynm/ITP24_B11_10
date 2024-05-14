import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const fetchReservations = async (date) => {
        try {
            const response = await axios.post(`${API_BASE}/api/reservation/approved-reservations`, { date });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchReservations(selectedDate)
            .then(data => {
                setReservations(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, [selectedDate]);

    const getDate = (date) => {
        const today = new Date(date);
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const year = today.getFullYear();
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();

        // Convert hours to AM/PM format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;

        // Add leading zero if minutes or seconds are less than 10
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `${month}/${day}/${year} ${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    };

    const groupByTableType = (items) => {
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.tableType]) {
                acc[item.tableType] = [];
            }
            acc[item.tableType].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map(tableType => ({
            tableType,
            items: grouped[tableType]
        }));
    };

    const groupByTimeSpan = (items) => {
        const grouped = items.reduce((acc, item) => {
            if (!acc[item.selectedTime]) {
                acc[item.selectedTime] = [];
            }
            acc[item.selectedTime].push(item);
            return acc;
        }, {});

        return Object.keys(grouped).map(selectedTime => ({
            selectedTime,
            items: grouped[selectedTime]
        }));
    };

    const handleGeneratePDF = () => {
        const groupedReservations = groupByTimeSpan(reservations);
        const groupedTableTypes = groupByTableType(reservations);

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.container}>
                        <Text style={styles.header}>Live Life Organics</Text>
                        <Text style={styles.date}>Generated: {new Date().toLocaleString()}</Text>

                        <Text style={styles.title}>Time Slots</Text>
                        {groupedReservations.map((group, index) => (
                            <View key={index} style={styles.groupItem}>
                                <Text style={styles.groupHeader}>{group.selectedTime}:</Text>
                                <Text style={styles.groupValue}>{group.items.length} Reservations</Text>
                            </View>
                        ))}
                        <Text style={styles.title}>Table Type</Text>
                        {groupedTableTypes.map((group, index) => (
                            <View key={index} style={styles.groupItem}>
                                <Text style={styles.groupHeader}>{group.tableType}:</Text>
                                <Text style={styles.groupValue}>{group.items.length} Reservations</Text>
                            </View>
                        ))}



                        <Text style={styles.title}>Reservation Details:</Text>
                        {groupedReservations.map((group, groupIndex) => (
                            <View key={groupIndex} style={styles.group}>
                                <Text style={styles.groupHeader}>{group.selectedTime}</Text>
                                {group.items.map((reservation, resIndex) => (
                                    <View key={resIndex} style={styles.reservationItem}>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Selected Date:</Text>
                                            <Text style={styles.value}>{getDate(reservation.selectedDate)}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Selected Time:</Text>
                                            <Text style={styles.value}>{reservation.selectedTime}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Name:</Text>
                                            <Text style={styles.value}>{reservation.name}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Username:</Text>
                                            <Text style={styles.value}>{reservation.username}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Email:</Text>
                                            <Text style={styles.value}>{reservation.email}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Number:</Text>
                                            <Text style={styles.value}>{reservation.number}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Table Type:</Text>
                                            <Text style={styles.value}>{reservation.tableType}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Guest Count:</Text>
                                            <Text style={styles.value}>{reservation.guestCount}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Fee:</Text>
                                            <Text style={styles.value}>{reservation.fee}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Payment ID:</Text>
                                            <Text style={styles.value}>{reservation.paymentId}</Text>
                                        </View>
                                        <View style={styles.labelContainer}>
                                            <Text style={styles.label}>Created At:</Text>
                                            <Text style={styles.value}>{getDate(reservation.createdAt)}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </Page>
            </Document>
        );
    };

    return (
        <div className="d-flex">
            <input className="form-control" type="date" value={selectedDate} onChange={handleDateChange} style={{ width: '200px' }} />
            <PDFDownloadLink document={handleGeneratePDF()} fileName="reservation_details.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </div>
    );
};

const styles = StyleSheet.create({
    page: {
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 10,
    },
    container: {
        margin: 20,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    groupItem: {
        marginBottom: 10,
        padding: 10,
        borderBottom: '1px solid #ccc',
    },
    groupHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    groupValue: {
        fontSize: 16,
    },
    reservationItem: {
        marginBottom: 20,
        border: '1px solid #ccc',
        padding: 10,
        borderRadius: 5,
    },
    labelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
});

export default PDFReservations;
