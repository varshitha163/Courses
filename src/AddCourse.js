import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const AddCourse = ({ onClose }) => {
  // Updated formData for Course Entity
  const [formData, setFormData] = useState({
    courseName: '',
    batchName: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for the field being edited if it's valid
    const errors = validateField(name, value);
    if (!errors[name]) {
      const newFormErrors = { ...formErrors };
      delete newFormErrors[name];
      setFormErrors(newFormErrors);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors({ ...formErrors, ...errors });
  };

  const validateField = (name, value) => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;

    switch (name) {
      case 'courseName':
        if (value.trim() === '') {
          errors.courseName = 'Course Name is required';
        } else if (!nameRegex.test(value)) {
          errors.courseName = 'Course Name should contain only letters';
        }
        break;
      case 'batchName':
        if (value.trim() === '') {
          errors.batchName = 'Batch Name is required';
        } else if (!nameRegex.test(value)) {
          errors.batchName = 'Batch Name should contain only letters';
        }
        break;
      case 'description':
        if (value.trim() === '') {
          errors.description = 'Description is required';
        }
        break;
      case 'startDate':
        if (value.trim() === '') {
          errors.startDate = 'Start Date is required';
        } else if (isNaN(Date.parse(value))) {
          errors.startDate = 'Invalid date format';
        }
        break;
      case 'endDate':
        if (value.trim() === '') {
          errors.endDate = 'End Date is required';
        } else if (isNaN(Date.parse(value))) {
          errors.endDate = 'Invalid date format';
        }
        break;
      default:
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};
    for (const key in formData) {
      const fieldErrors = validateField(key, formData[key]);
      Object.assign(errors, fieldErrors);
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      axios.post('http://localhost:8085/courses', formData) // Updated endpoint for course saving
        .then(response => {
          console.log('Course added:', response.data);
          setSnackbar({
            open: true,
            message: 'Course Registered Successfully',
            severity: 'success',
          });
          setFormErrors({});
          setFormData({
            courseName: '',
            batchName: '',
            description: '',
            startDate: '',
            endDate: '',
          });
        })
        .catch(error => {
          console.error('There was an error!', error);
          setSnackbar({
            open: true,
            message: 'Failed to save course. Please try again later.',
            severity: 'error',
          });
        });
    }
  };

  const handleCancel = () => {
    onClose(); // Close drawer on cancel
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });

    if (snackbar.severity === 'success') {
      setTimeout(() => {
        window.location.reload();
      }, 300); // Delay to ensure the snackbar is closed before page reloads
    }
  };

  const isFormValid = () => {
    return Object.keys(formData).every(key => formData[key].trim() !== '') &&
           Object.keys(formErrors).length === 0;
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px', width: '500px', position: 'relative' }}>
      <Grid item xs={3}>
        <Button
          sx={{
            height: '60px',
            marginTop: '8px',
            width: '90px',
            marginBottom:'20px',
            borderTopLeftRadius: '40%',
            borderBottomLeftRadius: '40%',
          }}
          variant="contained"
          color="error"
          onClick={handleCancel}
        >
          Close
        </Button>
      </Grid>
      <Typography variant="h4" align="center" gutterBottom sx={{marginTop: '-70px', marginBottom:'40px', marginLeft:'30px'}}>
        Course Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Course Name"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.courseName}
              helperText={formErrors.courseName}
              inputProps={{ pattern: "[A-Za-z\\s]*", title: "Only letters allowed" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Batch Name"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.batchName}
              helperText={formErrors.batchName}
              inputProps={{ pattern: "[A-Za-z\\s]*", title: "Only letters allowed" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.startDate}
              helperText={formErrors.startDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.endDate}
              helperText={formErrors.endDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type='submit'
              startIcon={<CheckCircleIcon color="success" /> }
              variant="contained"
              color="inherit"
              disabled={!isFormValid()}
              style={{ marginTop: '10px' }}
            >
              Save
            </Button>
            <Button
              onClick={handleCancel}
              color="inherit"
              variant="contained"
              startIcon={<CancelIcon color="error"  />}
              sx={{ marginTop: '10px', marginLeft: '10px'}}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
        <Snackbar 
          open={snackbar.open}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </form>
    </Container>
  );
};

export default AddCourse;
