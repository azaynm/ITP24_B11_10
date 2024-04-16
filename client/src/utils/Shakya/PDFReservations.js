import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    function getDate(date) {
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
    }

    const handleGeneratePDF = () => {
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text>Live Life Organics</Text>
                        <Text>Generated: {new Date().toLocaleString()}</Text>
                        <Text style={styles.title}>Reservation Details:</Text>
                        {reservations.map((reservation, index) => (
                            <View key={index} style={styles.reservationItem}>
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
                </Page>
            </Document>
        );
        return pdfContent;
    };

    return (
        <div className="d-flex">
             <input className="form-control" type="date" value={selectedDate} onChange={handleDateChange} style={{width:'200px'}} />
            <PDFDownloadLink document={handleGeneratePDF()} fileName="reservation_details.pdf">
                {({ blob, url, loading, error }) =>
                    loading ? 'Loading document...' : 'Download PDF'
                }
            </PDFDownloadLink>
        </div>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: '20px',
        padding: '20px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'center',
    },
    reservationItem: {
        marginBottom: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
    },
    labelContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label: {
        fontWeight: 'bold',
        marginRight: '5px',
    },
    value: {
        flex: 1,
    },
});

export default PDFReservations;
