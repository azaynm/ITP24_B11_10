import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const API_BASE = "http://localhost:8080";

const PDFMyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(`${API_BASE}/api/order/orders/${localStorage.getItem('username')}`);
          setOrders(response.data);
          console.log(response.data)
        } catch (error) {
          console.log("Error fetching data:", error);
        } finally {
          setIsLoading(false);
        }
      };

    useEffect(() => {
        fetchOrders();
    }, []);

    const generatePDFContent = () => (
        <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Text>Live Life Organics</Text>
                    <Text>Generated: {new Date().toLocaleString()}</Text>
                    <Text style={styles.title}>Order Details:</Text>
                    {orders.map((order, index) => (
                        <View key={index} style={styles.orderItem}>
                            <Text>Customer: {order.customer}</Text>
                            <Text>Amount: {order.amount}</Text>
                            <Text>Payment ID: {order.paymentId}</Text>
                            <Text>Status: {order.status}</Text>
                            <Text>Address: {order.address}</Text>
                            <Text>City: {order.city}</Text>
                            <Text>Phone: {order.phone}</Text>
                            <Text>Delivery Staff: {order.deliveryStaff}</Text>
                            <Text>Chef: {order.cheff}</Text>
                            <Text>Feedback Given: {order.isFeedbackGiven ? 'Yes' : 'No'}</Text>
                            <Text>Time: {new Date(order.time).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <PDFDownloadLink document={generatePDFContent()} fileName="orders.pdf">
                        {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
                    </PDFDownloadLink>
                </div>
            )}
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
});

export default PDFMyOrders;
