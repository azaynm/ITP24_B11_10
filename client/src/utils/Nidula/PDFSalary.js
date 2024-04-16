import React, { useEffect, useState } from "react";
import axios from 'axios';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink } from '@react-pdf/renderer';

// Define API_BASE
const API_BASE = "http://localhost:8080";

const PDFSalary = () => {
    const [salaries, setSalaries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchSalaries = async () => {
        try {
            const response = await axios.get(`${API_BASE}/api/salary/salary`);
            return response.data;
        } catch (error) {
            console.error('Error fetching salaries:', error);
            throw new Error('Failed to fetch salaries');
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetchSalaries()
            .then(data => {
                setSalaries(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    const generatePDFContent = () => (
        <Document>
            <Page size="A4">
                <View style={styles.container}>
                    <Text>Live Life Organics</Text>
                    <Text>Generated: {new Date().toLocaleString()}</Text>
                    <Text style={styles.title}>Salary Details:</Text>
                    {salaries.map((salary, index) => (
                        <View key={index} style={styles.salaryItem}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>User Name:</Text>
                                <Text style={styles.value}>{salary.userName}</Text>
                            </View>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Month:</Text>
                                <Text style={styles.value}>{new Date(salary.month).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Salary:</Text>
                                <Text style={styles.value}>Rs.{salary.salary}</Text>
                            </View>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Is Paid:</Text>
                                <Text style={styles.value}>{salary.isPaid ? 'Yes' : 'No'}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );

    return (
        <div>
            
            <PDFDownloadLink document={generatePDFContent()} fileName="salary.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF')}
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
    salaryItem: {
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

export default PDFSalary;
