import React, { useState, useEffect } from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import AddCourse from './AddCourse';
import UpdateCourse from './UpdateCourse';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: `1px solid ${alpha(theme.palette.common.black, 0.15)}`,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: '25%',
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#04000c',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: theme.spacing(1),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
    '&::placeholder': {
      color: '#0E3B64',
      fontWeight: 'bold',
      textAlign: 'left',
    },
  },
}));

const RedButton = styled(Button)(({ theme }) => ({
  color: 'white',
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#0E3B64',
  padding: theme.spacing(1),
  textAlign: 'left',
  fontSize: '0.9rem',
  borderBottom: 'none',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

// Updated columns to reflect CoursesEntity
const columns = [
  { id: 'courseId', label: 'Course ID', minWidth: 100 },
  { id: 'courseName', label: 'Course Name', minWidth: 150 },
  { id: 'batchName', label: 'Batch Name', minWidth: 150 },
  { id: 'description', label: 'Description', minWidth: 150 },
  { id: 'startDate', label: 'Start Date', minWidth: 120 },
  { id: 'endDate', label: 'End Date', minWidth: 120 },
  { id: 'edit', label: 'Status', minWidth: 100, align: 'center' },
];

const Course = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [allCourses, setAllCourses] = useState([]); // Ensure initial state is an array
  const [filteredCourses, setFilteredCourses] = useState([]); // Ensure initial state is an array
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // Ensure initial state is null

  useEffect(() => {
    fetchCourses(); // Fetch courses on component mount
  }, []);

  useEffect(() => {
    filterCourses(); // Filter courses whenever searchQuery or allCourses changes
  }, [searchQuery, allCourses]);

  // Fetch courses from backend
  const fetchCourses = () => {
    axios
      .get('http://localhost:8085/courses') // Ensure the endpoint matches your backend setup
      .then((response) => {
        const courses = response.data.data; // Corrected to access the 'data' array
        if (Array.isArray(courses)) {
          setAllCourses(courses);
          setFilteredCourses(courses);
        } else {
          console.error('Expected array but received:', courses);
          setAllCourses([]); // Reset to empty array if response is not array
          setFilteredCourses([]);
        }
      })
      .catch((error) => console.error('Error fetching courses:', error));
  };

  // Filter courses based on search query
  const filterCourses = () => {
    const query = (searchQuery || '').trim().toLowerCase();
    console.log('Search Query:', query); // Debugging statement

    if (query === '') {
      setFilteredCourses(allCourses);
      setError('');
    } else {
      const filtered = allCourses.filter((course) => {
        const courseName = (course.courseName || '').toLowerCase();
        const description = (course.description || '').toLowerCase();
        const batchName = (course.batchName || '').toLowerCase();

        return (
          courseName.includes(query) ||
          description.includes(query) ||
          batchName.includes(query)
        );
      });

      setFilteredCourses(filtered);
      setError(
        filtered.length === 0
          ? 'Course not available. Please create the Course.'
          : ''
      );
    }
  };

  // Handle previous button click for pagination
  const handlePreviousButtonClick = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Handle next button click for pagination
  const handleNextButtonClick = () => {
    if ((page + 1) * rowsPerPage < filteredCourses.length) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle edit button click
  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setDrawerOpen(true);
  };

  // Handle drawer open
  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  // Handle drawer close
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCourse(null); // Clear selected course when closing
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <AppBar position="static" sx={{ p: 1, backgroundColor: 'white' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'none', sm: 'block' },
              color: '#000080',
              fontWeight: 'bold',
            }}
          >
            All Courses
          </Typography>
          <Search>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '35px',
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDrawer} // Open drawer
          startIcon={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'red',
              }}
            >
              <AddIcon fontSize="small" />
            </div>
          }
          style={{ textTransform: 'none', backgroundColor: '#F2545B' }}
        >
          Add Course
        </Button>
        <Typography
          variant="body2"
          color="error"
          sx={{ marginLeft: '8px', fontWeight: 'bold' }}
        >
          {error}
        </Typography>
      </Box>
      <div style={{ marginTop: '20px' }}>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <StyledTableCell
                      key={column.id}
                      align={column.align || 'left'} // Default alignment to 'left'
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: 'bold',
                      }} // Consistent column label styling
                    >
                      {column.label}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCourses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <StyledTableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.courseId} // Use courseId as key
                    >
                      <StyledTableCell>{row.courseId}</StyledTableCell>
                      <StyledTableCell>{row.courseName}</StyledTableCell>
                      <StyledTableCell>{row.batchName}</StyledTableCell>
                      <StyledTableCell>{row.description}</StyledTableCell>
                      <StyledTableCell>
                        {new Date(row.startDate).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell>
                        {new Date(row.endDate).toLocaleDateString()}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Typography
                          onClick={() => handleEditClick(row)}
                          sx={{ cursor: 'pointer', fontSize: '13px' }}
                        >
                          Edit
                        </Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <hr />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '10px',
            }}
          >
            <Button
              onClick={handlePreviousButtonClick}
              sx={{
                color: '#0E3B64',
                backgroundColor: 'whitesmoke',
                marginRight: '8px',
                textTransform: 'capitalize',
              }}
              className="CustomButton"
              disabled={page === 0}
            >
              Previous
            </Button>
            <RedButton
              sx={{
                color: 'white',
                marginRight: '8px',
              }}
              className="CustomButton"
              disabled={(page + 1) * rowsPerPage >= filteredCourses.length}
            >
              {page + 1}
            </RedButton>
            <Button
              onClick={handleNextButtonClick}
              sx={{
                color: '#0E3B64',
                backgroundColor: 'whitesmoke',
                marginRight: '8px',
                textTransform: 'capitalize',
              }}
              className="CustomButton"
              disabled={(page + 1) * rowsPerPage >= filteredCourses.length}
            >
              Next
            </Button>
          </Box>
        </Paper>
      </div>
      <Drawer anchor="right" open={drawerOpen} onClose={handleCloseDrawer}>
        {selectedCourse ? (
          <UpdateCourse
            course={selectedCourse}
            onClose={handleCloseDrawer} // Ensure onClose is passed correctly
          />
        ) : (
          <AddCourse onClose={handleCloseDrawer} /> // Ensure onClose is passed correctly
        )}
      </Drawer>
    </Box>
  );
};

export default Course;
