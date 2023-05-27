import React, { useState } from 'react';
import { createClient } from '@sanity/client';
import './ElectricityForm.css';
import AdminDashboard from './components/AdminDashboard';
import { GridLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { validateAdharNumber, validateDate, validateNumberString, validatePhoneNumber, validateTextString } from './validation';
import { client } from './utils/sanity';

const App = () => {
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
        country: ''
    });

    const [Toggle, setToggle] = useState(false)
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setFormData({
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
            country: ''
        });
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (event.target.name === "customerName" || event.target.name === "fatherName" || event.target.name === "caste" || event.target.name === "city" || event.target.name === "district" || event.target.name === "country" || event.target.name === "serviceType" || event.target.name === "sex" || event.target.name === "maritalStatus") {
            if (!validateTextString(event.target.value)) {
                toast.error(`Invalid ${event.target.name} value. Must contain only letters.`, {
                    toastId: event.target.name,
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                return;
            }
        }

        if (event.target.name === "adharNumber") {
            if (!validateAdharNumber(event.target.value)) {
                toast.error('Invalid Aadhaar number. Must contain 12 digits.', {
                    toastId: 'AdharNumber',
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
        }

        if (event.target.name === "phoneNumber") {
            if (!validatePhoneNumber(event.target.value)) {
                toast.error('Invalid phone number. Must contain 10 digits.', {
                    toastId: 'PhoneNumber',
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                return;
            }
        }

        setLoading(true);

        const document = {
            _type: 'electricityServiceForm',
            ...formData
        };

        fetch('http://localhost:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document)
        }).then(data => {
            if (data.status >= 200 && data.status < 300) {
                toast.success('Form submitted successfully.', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                resetForm();
            }
            setLoading(false);
        }).catch(error => {
            toast.error('Something went wrong. Please try again later.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            setLoading(false);
        });
    };


    return (
        <div className="App">
            {Toggle ? <AdminDashboard setToggle={setToggle} setLoading={setLoading} Loading={loading} /> :
                <>
                    <header>
                        <button className="submit-btn" onClick={() => setToggle(true)}>See Electricity Data</button>
                    </header>
                    {!loading && <div className="form-container">
                        <h1>Electricity Service Form</h1>
                        <form onSubmit={handleSubmit} style={{ 'width': '100%' }}>
                            <label>
                                Service Type:
                                <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                                    <option value="">Select an option</option>
                                    <option value="New Connection">New Connection</option>
                                    <option value="Disconnection">Disconnection</option>
                                    <option value="Transfer">Transfer</option>
                                    <option value="Name Change">Name Change</option>
                                    <option value="Billing">Billing</option>
                                </select>
                            </label>
                            <label>
                                Customer Name:
                                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} />
                            </label>
                            <label>
                                Aadhaar Number:
                                <input type="text" name="adharNumber" value={formData.adharNumber} onChange={handleChange} />
                            </label>
                            <label>
                                Phone Number:
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                            </label>
                            <label>
                                Sex:
                                <input type="radio" name="sex" value="Male" checked={formData.sex === "Male"} onChange={handleChange} /> Male
                                <input type="radio" name="sex" value="Female" checked={formData.sex === "Female"} onChange={handleChange} /> Female
                                <input type="radio" name="sex" value="Other" checked={formData.sex === "Other"} onChange={handleChange} /> Other
                            </label>
                            <label>
                                Marital Status:
                                <input type="radio" name="maritalStatus" value="Married" checked={formData.maritalStatus === "Married"} onChange={handleChange} /> Married
                                <input type="radio" name="maritalStatus" value="Unmarried" checked={formData.maritalStatus === "Unmarried"} onChange={handleChange} /> Unmarried
                            </label>
                            <label>
                                Father's Name:
                                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                            </label>
                            <label>
                                Caste:
                                <input type="text" name="caste" value={formData.caste} onChange={handleChange} />
                            </label>
                            <label>
                                House Number:
                                <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} />
                            </label>
                            <label>
                                Street Name:
                                <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} />
                            </label>
                            <label>
                                City:
                                <input type="text" name="city" value={formData.city} onChange={handleChange} />
                            </label>
                            <label>
                                Pincode:
                                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                            </label>
                            <button type="submit" disabled={loading}>Submit</button>
                        </form>
                    </div>}
                    {loading && <div className="maincontainer">
                        <GridLoader color='#36d7b7' />
                    </div>}
                </>
            }
        </div>
    );
};
export default App;
