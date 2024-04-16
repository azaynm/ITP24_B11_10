import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    
    const [preparedTime, setPreparedTime] = useState({});
    const [deliveredTime, setDeliveredTime] = useState({})

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };


    const fetchDeliveries = async (date) => {
        try {
            const response = await axios.post(`${API_BASE}/api/delivery/completed-deliveries`, { date });
            return response.data;
        } catch (error) {
            console.error('Error fetching reservations:', error);
            throw new Error('Failed to fetch reservations');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchDeliveries(selectedDate)
            .then(data => {
                setDeliveries(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, [selectedDate]);

    useEffect(() => {
        // Fetch paid status for each employee when employees change
        deliveries.forEach(delivery => {
            fetchTimes(delivery._id);
        });
    }, [deliveries]);

     
    const fetchTimes = async (orderId) => {
        try {
            const response = await axios.get(`${API_BASE}/api/delivery/get-time/${orderId}`);
            if (response.status === 200) {
                const { preparedTime, deliveredTime } = response.data;
                setPreparedTime(prevState => ({
                    ...prevState,
                    [orderId]: preparedTime
                }));
                setDeliveredTime(prevState => ({
                    ...prevState,
                    [orderId]: deliveredTime
                }));
                console.log(deliveredTime)
            }
        } catch (error) {
            console.error('Error fetching paid status:', error);
        }
    };





    function getDate(time) {
        const date = new Date(time);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return formattedDate;
    }

    const handleGeneratePDF = () => {
        const pdfContent = (
            <Document>
                <Page size="A4">
                    <View style={styles.container}>
                        <Text>Live Life Organics</Text>
                        <Text>Generated: {new Date().toLocaleString()}</Text>
                        <Text style={styles.title}>Order Details:</Text>
                        {deliveries.map((delivery, index) => (
                            <View key={index} style={styles.orderItem}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Customer:</Text>
                                    <Text style={styles.value}>{delivery.customer}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Amount:</Text>
                                    <Text style={styles.value}>Rs.{delivery.amount}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Status:</Text>
                                    <Text style={styles.value}>{delivery.status}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Address:</Text>
                                    <Text style={styles.value}>{delivery.address}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>City:</Text>
                                    <Text style={styles.value}>{delivery.city}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Phone:</Text>
                                    <Text style={styles.value}>{delivery.phone}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Delivery Staff:</Text>
                                    <Text style={styles.value}>{delivery.deliveryStaff}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Cheff:</Text>
                                    <Text style={styles.value}>{delivery.cheff}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Is Feedback Given:</Text>
                                    <Text style={styles.value}>{delivery.isFeedbackGiven ? 'Yes' : 'No'}</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Time:</Text>
                                    <Text style={styles.value}>{getDate(delivery.time)}</Text>
                                </View>

                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Prepared Time:</Text>
                                    <Text style={styles.value}>{preparedTime[delivery._id]}</Text>
                                </View>

                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>Delivered Time:</Text>
                                    <Text style={styles.value}>{deliveredTime[delivery._id]}</Text>
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
        <div>
            <input className="form-control" type="date" value={selectedDate} onChange={handleDateChange} style={{width:'200px'}} />
            <PDFDownloadLink document={handleGeneratePDF()} fileName="delivery.pdf">
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
    orderItem: {
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

export default PDFDeliveries;
