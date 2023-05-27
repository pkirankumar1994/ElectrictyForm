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
    meterNumber: '',
    ownerName: '',
    date: '',
    time: '',
    meterReading: '',
    houseNumber: '',
    phoneNumber: '',
    adharNumber: ''
  });

  const [Toggle, setToggle] = useState(false)
  const [Loading, setLoading] = useState(false)

  const resetForm = () => {
    setFormData({
      meterNumber: '',
      ownerName: '',
      date: '',
      time: '',
      meterReading: '',
      houseNumber: '',
      phoneNumber: '',
      adharNumber: ''
    });
  }

  const handleChange = (event) => {
    if (event.target.name === "ownerName") {
      if (validateNumberString(event.target.value)) {
        toast.error('Meter Owner Name must contain only letters.', {
          toastId: 'OwnerName',
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
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    } else {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValidPhoneNumber = validatePhoneNumber(formData.phoneNumber);
    const isValidAdharNumber = validateAdharNumber(formData.adharNumber);
    const isValidDate = validateDate(formData.date);

    if (!isValidPhoneNumber) {
      toast.error('Please enter a valid phone number', {
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

    if (!isValidAdharNumber) {
      toast.error('Please enter a valid Aadhaar number', {
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

    if (!isValidDate) {
      toast.error('Please select today date or future date', {
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

    if (!validateTextString(formData.ownerName)) {
      toast.error('Meter Owner Name must contain only letters.', {
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

    setLoading(true);

    const document = {
      _type: 'electricityServiceForm',
      ...formData
    };

    client.create(document)
      .then(() => {
        setLoading(false);
        toast.success('🦄 Wow so easy!', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        resetForm();
      })
      .catch((error) => {
        setLoading(false);
        alert('Error submitting data: ', error);
      });
  };

  return (
    <div>
      {Toggle ? <AdminDashboard setToggle={setToggle} setLoading={setLoading} Loading={Loading} /> : <>
        <header>
          <button className="submit-btn" onClick={() => setToggle(true)}>See Electricity Data</button>
        </header>

        {!Loading &&
          <div className="maincontainer"><form className="container" onSubmit={handleSubmit}>
            <label htmlFor="meterNumber">Meter Number:</label>
            <input
              type="number"
              name="meterNumber"
              id="meterNumber"
              value={formData.meterNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="ownerName">Meter Owner Name:</label>
            <input
              type="text"
              name="ownerName"
              id="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />

            <label htmlFor="date">Date:</label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            <label htmlFor="time">Time:</label>
            <input
              type="time"
              name="time"
              id="time"
              value={formData.time}
              onChange={handleChange}
              required
            />

            <label htmlFor="meterReading">Meter Reading:</label>
            <input
              type="number"
              name="meterReading"
              id="meterReading"
              value={formData.meterReading}
              onChange={handleChange}
              required
            />

            <label htmlFor="houseNumber">House Number:</label>
            <input
              type="number"
              name="houseNumber"
              id="houseNumber"
              value={formData.houseNumber}
              onChange={handleChange}
              required
            />

            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder='0123456789'
            />

            <label htmlFor="adharNumber">Adhar Number:</label>
            <input
              type="text"
              name="adharNumber"
              id="adharNumber"
              value={formData.adharNumber}
              onChange={handleChange}
              required
              placeholder='**** **** ****'
            />

            <button className="submit-btn" type="submit">Submit</button>
          </form>
          </div>}
        {Loading && <div className="maincontainer">
          <GridLoader color='#36d7b7' />
        </div>}
      </>
      }
    </div>
  );
};

export default App;
