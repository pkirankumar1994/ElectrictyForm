import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { GridLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios';

function AdminDashboard({ setToggle }) {
    const [electricityData, setElectricityData] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        serviceType: '',
        customerName: '',
        adharNumber: '',
        phoneNumber: '',
        sex: '',
        fatherName: '',
        caste: '',
        maritalStatus: '',
        houseNumber: '',
        streetName: '',
        landmark: '',
        city: '',
        district: '',
        pincode: '',
        country: '',
        id: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/');
                console.log(response.data);
                setElectricityData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        setLoading(true);
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:8000/electricity/${id}`);
                console.log(response.data);
                setElectricityData(electricityData.filter((data) => data.id !== id));
                toast.info(`Record with ID ${id} deleted successfully`, {
                    position: 'bottom-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light'
                });
            } catch (error) {
                console.error(error);
            }
        }
        setLoading(false);
    };

    const handleUpdate = async (id) => {
        setLoading(true);
        const recordToUpdate = electricityData.find((record) => record.id === id);
        if (!recordToUpdate) {
            alert(`Record with ID ${id} not found`);
            setLoading(false);
            return;
        }
        const updatedRecord = { ...recordToUpdate };
        for (const [key, value] of Object.entries(updatedRecord)) {
            if (key !== 'id') {
                updatedRecord[key] = prompt(
                    `Enter updated ${key} (currently ${value}):`
                ) || value;
            }
        }
        try {
            const response = await axios.put(`http://localhost:8000/electricity/${id}`, updatedRecord);
            console.log(response.data);
            setElectricityData(
                electricityData.map((record) =>
                    record.id === id ? { ...record, ...updatedRecord } : record
                )
            );
            toast.success(`Record with ID ${id} updated successfully`, {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <>
            {Loading && <div className="maincontainer">
                <GridLoader color='#36d7b7' />
            </div>}
            {!Loading && <div className="admin-dashboard">
                <header>
                    <button className="submit-btn" onClick={() => setToggle(false)}>Main Form</button>
                </header>
                <h1>Electricity Service Records</h1>
                <table className="electricity-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Service Type</th>
                            <th>Customer Name</th>
                            <th>Adhar Number</th>
                            <th>Phone Number</th>
                            <th>Sex</th>
                            <th>Father Name</th>
                            <th>Caste</th>
                            <th>Marital Status</th>
                            <th>House Number</th>
                            <th>Street Name</th>
                            <th>City</th>
                            <th>Pincode</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {electricityData.map((data) => (
                            <tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.serviceType}</td>
                                <td>{data.customerName}</td>
                                <td>{data.adharNumber}</td>
                                <td>{data.phoneNumber}</td>
                                <td>{data.sex}</td>
                                <td>{data.fatherName}</td>
                                <td>{data.caste}</td>
                                <td>{data.maritalStatus}</td>
                                <td>{data.houseNumber}</td>
                                <td>{data.streetName}</td>
                                <td>{data.city}</td>
                                <td>{data.pincode}</td>
                                <td>
                                    <button onClick={() => handleUpdate(data.id)}>Update</button>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(data.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>}
        </>
    );
}

export default AdminDashboard;
