import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Grid, Typography, Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import PropTypes from 'prop-types';
import dayjs from 'dayjs'; // For date handling

const UpdateCourse = ({ onClose, course }) => {
  const [formData, setFormData] = useState({
    courseName: course ? course.courseName : '',
    description: course ? course.description : '',
    startDate: course ? dayjs(course.startDate).format('YYYY-MM-DD') : '',
    endDate: course ? dayjs(course.endDate).format('YYYY-MM-DD') : '',
    batchName: course ? course.batchName : '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName,
        description: course.description,
        startDate: dayjs(course.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(course.endDate).format('YYYY-MM-DD'),
        batchName: course.batchName,
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const errors = validateField(name, value);
    setFormErrors({ ...formErrors, ...errors });
  };

  const validateField = (name, value) => {
    const errors = {};
    switch (name) {
      case 'courseName':
        if (value.trim() === '') {
          errors.courseName = 'Course name is required';
        }
        break;
      case 'description':
        if (value.trim() === '') {
          errors.description = 'Description is required';
        }
        break;
      case 'startDate':
        if (!value) {
          errors.startDate = 'Start date is required';
        }
        break;
      case 'endDate':
        if (!value) {
          errors.endDate = 'End date is required';
        }
        break;
      case 'batchName':
        if (value.trim() === '') {
          errors.batchName = 'Batch name is required';
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
      axios.put(`http://localhost:8085/courses/${course.courseId}`, formData)
        .then(response => {
          console.log('Course updated:', response.data);
          setSnackbar({
            open: true,
            message: 'Course updated successfully.',
            severity: 'success',
          });
          setFormErrors({});
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch(error => {
          console.error('There was an error!', error);
          setSnackbar({
            open: true,
            message: 'Failed to update course. Please try again later.',
            severity: 'error',
          });
        });
    }
  };

  const handleClose = () => {
    onClose(); // Close the drawer on cancel
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" style={{ padding: '20px', width: '500px', position: 'relative' }}>
      <Grid item xs={3}>
        <Button
          sx={{
            height: '60px',
            marginTop: '8px',
            width: '90px',
            marginBottom: '20px',
            borderTopLeftRadius: '40%',
            borderBottomLeftRadius: '40%',
          }}
          variant="contained"
          color="error"
          onClick={handleClose}
        >
          Close
        </Button>
      </Grid>
      <Typography variant="h4" align="center" gutterBottom sx={{ marginTop: '-70px', marginBottom: '40px', marginLeft: '30px' }}>
        Edit Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.description}
              helperText={formErrors.description}
            />
          </Grid>
          <Grid item xs={12}>
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
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
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
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
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              startIcon={<CheckCircleIcon color='success' />}
              variant="contained"
              color="inherit"
              style={{ marginTop: '10px' }}
            >
              Update
            </Button>
            <Button
              onClick={handleClose}
              color="inherit"
              variant="contained"
              startIcon={<CancelIcon color="error" />}
              sx={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
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
    </Container>
  );
};

UpdateCourse.propTypes = {
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    courseId: PropTypes.number.isRequired,
    courseName: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    batchName: PropTypes.string,
  }).isRequired,
};

export default UpdateCourse;
