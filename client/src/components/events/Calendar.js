import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Paper,
  Divider,
  Box,
  TextField,
  Grow,
  Button,
  Grid,
  Dialog,
  DialogContent,
  List,
  Avatar,
  ListItemAvatar,
  ListItem,
  ListItemText,
  DialogActions,
  CardActions,
  IconButton,
  styled,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Close,
  Add,
  AccessTime,
  Delete,
  LocationOn,
} from "@mui/icons-material";
import BootstrapDialogTitle from "./DialogTitle";
import { makeStyles } from "@mui/styles";
import MapboxAutocomplete from "react-mapbox-autocomplete";
import "./Calendar.css";
import {
  AddressAutofill,
  AddressMinimap,
  useConfirmAddress,
  config,
} from "@mapbox/search-js-react";
import Mapbox from "../../Map";

const localizer = momentLocalizer(moment);

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: "#181818",
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  calendarContainer: {
    flex: 1,
    height: "80vh",
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

const EventsList = ({
  events,
  setOpen,
  onDeleteEvent,
  selectedEvent,
  setSelectedEvent,
  onRegisterUser,
  registeredUsers,
}) => {
  const [userName, setUserName] = useState("");

  const handleChangeName = (event) => {
    setUserName(event.target.value);
  };

  const handleRegisterUser = () => {
    if (selectedEvent && selectedEvent.id && userName.trim() !== "") {
      onRegisterUser(selectedEvent.id, userName.trim());
      setUserName("");
    }
  };

  const handleDeleteEvent = (index) => {
    onDeleteEvent(index);
  };

  return (
    <div>
      {selectedEvent ? (
        <>
          <div>
            <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography sx={{ color: "white" }} variant="h4" fontWeight={600}>
                Selected Event
              </Typography>
              <IconButton onClick={() => setSelectedEvent(null)}>
                <Close sx={{ color: "white" }} />
              </IconButton>
            </Box>
            <Card
              key={selectedEvent.title}
              sx={{
                mb: 4,
                borderRadius: "10px",
                boxShadow: 3,
                backgroundColor: "#2f2f2f",
              }}
              elevation={0}
            >
              <CardContent>
                <Typography sx={{ color: "white" }} variant="h6">
                  {selectedEvent.title}
                </Typography>
                <Typography sx={{ color: "white" }} variant="h6">
                  {selectedEvent.tutoring ? "Tutoring" : ""}
                </Typography>
                <Typography
                  sx={{ color: "white" }}
                  variant="body1"
                  color="text.secondary"
                  mb={1}
                >
                  {selectedEvent.description}
                </Typography>
                <Typography
                  sx={{ color: "white" }}
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  mb={1}
                >
                  <AccessTime />
                  &nbsp;Start:&nbsp;
                  {moment(selectedEvent.start).format("LLL")}
                </Typography>
                <Typography
                  sx={{ color: "white" }}
                  variant="body2"
                  display="flex"
                  alignItems="center"
                >
                  <AccessTime />
                  &nbsp;End:&nbsp;
                  {moment(selectedEvent.end).format("LLL")}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography sx={{ color: "white" }} variant="h6">
                  Registered Users:
                </Typography>
                <List>
                  {registeredUsers[selectedEvent.id]?.length > 0 ? (
                    <Typography sx={{ color: "white" }}>
                      {registeredUsers[selectedEvent.id]?.length} users
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "white" }}>0 users</Typography>
                  )}
                  {registeredUsers[selectedEvent.id]?.map((user, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar />
                      </ListItemAvatar>
                      <ListItemText primary={user} sx={{ color: "white" }} />
                      <Divider />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardContent sx={{ display: "flex", alignitems: "center" }}>
                <TextField
                  label="Your Name"
                  variant="outlined"
                  fullWidth
                  value={userName}
                  onChange={handleChangeName}
                  sx={[
                    { input: { color: "white" } },
                    {
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "lightgray",
                        },
                        "&:hover fieldset": {
                          borderColor: "lightgray",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "lightgray",
                        },
                      },
                      "& label": {
                        color: "lightgray",
                      },
                      "& label.Mui-focused": {
                        color: "lightgray",
                      },
                      ".MuiFormHelperText-root": { color: "lightgray" },
                      ".MuiOutlinedInput-root.Mui-focused": {
                        borderColor: "lightgray",
                      },
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "lightgray",
                      },
                      caretColor: "lightgray",
                      mr: 3,
                    },
                  ]}
                />
                <Button
                  onClick={handleRegisterUser}
                  sx={{
                    textTransform: "none",
                    color: "white",
                    border: "1px solid white",
                  }}
                >
                  Register user
                </Button>
              </CardContent>
            </Card>
          </div>
          <Box sx={{ mb: 2 }}>
            <Mapbox />
          </Box>
        </>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography sx={{ color: "white" }} variant="h4" fontWeight={600}>
              Events List
            </Typography>
            <IconButton onClick={() => setOpen(true)}>
              <Add sx={{ color: "white" }} />
            </IconButton>
          </Box>
          {events.length === 0 && (
            <Typography sx={{ color: "white" }} textAlign="center">
              No events. Create one by clicking the add icon in the top right.
            </Typography>
          )}
          {events.map((event, index) => (
            <Grow key={index} in={true} timeout={500}>
              <Card
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: "10px",
                  backgroundColor: "#2f2f2f",
                  boxShadow: 0,
                }}
                elevation={0}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {event.title}
                  </Typography>
                  <Typography
                    sx={{ color: "white" }}
                    variant="body1"
                    color="text.secondary"
                    mb={1}
                  >
                    {event.description}
                  </Typography>
                  <Typography
                    sx={{ color: "white" }}
                    variant="body2"
                    display="flex"
                    alignItems="center"
                    mb={1}
                  >
                    <AccessTime />
                    &nbsp;Start:&nbsp;
                    {moment(event.start).format("LLL")}
                  </Typography>
                  <Typography
                    sx={{ color: "white" }}
                    variant="body2"
                    display="flex"
                    alignItems="center"
                  >
                    <AccessTime />
                    &nbsp;End:&nbsp;
                    {moment(event.end).format("LLL")}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteEvent(index)}
                  >
                    <Delete sx={{ color: "white" }} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grow>
          ))}
        </>
      )}
    </div>
  );
};

const Calendar = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState({});
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [tutoring, setTutoring] = useState(false);
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("calendarEvents");
    return storedEvents
      ? JSON.parse(storedEvents)
      : [
          {
            start: moment().toDate(),
            end: moment().add(1, "days").toDate(),
            title: "Some title",
          },
        ];
  });

  const handleLocationChange = (result) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      location: result,
    }));
  };

  const [newEvent, setNewEvent] = useState({
    start: null,
    end: null,
    title: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
    if (adding || deleting) {
      setTimeout(() => {
        setAdding(false);
        setDeleting(false);
      }, 500);
    }
  }, [events, adding, deleting]);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleDeleteEvent = (index) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents];
      updatedEvents.splice(index, 1);
      setDeleting(true);
      return updatedEvents;
    });
  };

  const handleStartDateChange = (start) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      start,
    }));
  };

  const handleEndDateChange = (end) => {
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      end,
    }));
  };

  const handleAddEvent = () => {
    const { start, end, title, location, tutoring } = newEvent;
    if (start && end && title) {
      const newEventWithId = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setEvents((prevEvents) => [...prevEvents, newEventWithId]);
      setNewEvent({
        start: null,
        end: null,
        title: "",
        description: "",
        location: "",
      });
      setOpen(false);
      setAdding(true);
    }
  };

  const handleRegisterUser = (eventId, userName) => {
    setRegisteredUsers((prevRegisteredUsers) => ({
      ...prevRegisteredUsers,
      [eventId]: [...(prevRegisteredUsers[eventId] || []), userName],
    }));
  };

  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(events));
  }, [events]);

  const CustomLocation = React.forwardRef(function CustomLocation(props, ref) {
    const { ...other } = props;

    return (
      <MapboxAutocomplete
        {...other}
        publicKey="pk.eyJ1IjoidmF3ZXNvbWUiLCJhIjoiY2x2OG9sdTZ4MDBpZjJrczJsYWl4bWpiZSJ9.QdIlDnefuby3509o7-WzPg"
        inputClass="form-control search"
        onSuggestionSelect={handleLocationChange}
        country="US"
        resetSearch={false}
      />
    );
  });

  return (
    <Box>
      <BootstrapDialog open={open} onClose={() => setOpen(false)}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={() => setOpen(false)}
          sx={{ color: "white" }}
        >
          Add An Event
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ width: "35vw" }}>
          <Box p={2}>
            <TextField
              label="Event Title"
              variant="outlined"
              fullWidth
              name="title"
              value={newEvent.title}
              onChange={handleChange}
              sx={[
                { input: { color: "white" } },
                {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgray",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                  "& label": {
                    color: "lightgray",
                  },
                  "& label.Mui-focused": {
                    color: "lightgray",
                  },
                  ".MuiFormHelperText-root": { color: "lightgray" },
                  ".MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "lightgray",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "lightgray",
                  },
                  caretColor: "lightgray",
                },
              ]}
            />
          </Box>
          <Box p={2}>
            <TextField
              fullWidth
              label="Event Description"
              variant="outlined"
              name="description"
              value={newEvent.description}
              onChange={handleChange}
              sx={[
                { input: { color: "white" } },
                {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgray",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                  "& label": {
                    color: "lightgray",
                  },
                  "& label.Mui-focused": {
                    color: "lightgray",
                  },
                  ".MuiFormHelperText-root": { color: "lightgray" },
                  ".MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "lightgray",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "lightgray",
                  },
                  caretColor: "lightgray",
                },
              ]}
            />
          </Box>
          <Box p={2}>
            <TextField
              label="Start Time"
              variant="outlined"
              fullWidth
              type="datetime-local"
              name="start"
              value={newEvent.start || ""}
              onChange={(e) => handleStartDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={[
                { input: { color: "white" } },
                {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgray",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                  "& label": {
                    color: "lightgray",
                  },
                  "& label.Mui-focused": {
                    color: "lightgray",
                  },
                  ".MuiFormHelperText-root": { color: "lightgray" },
                  ".MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "lightgray",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "lightgray",
                  },
                  caretColor: "lightgray",
                },
              ]}
            />
          </Box>
          <Box p={2}>
            <TextField
              label="End Time"
              variant="outlined"
              fullWidth
              type="datetime-local"
              name="end"
              value={newEvent.end || ""}
              onChange={(e) => handleEndDateChange(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={[
                { input: { color: "white" } },
                {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgray",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                  "& label": {
                    color: "lightgray",
                  },
                  "& label.Mui-focused": {
                    color: "lightgray",
                  },
                  ".MuiFormHelperText-root": { color: "lightgray" },
                  ".MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "lightgray",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "lightgray",
                  },
                  caretColor: "lightgray",
                },
              ]}
            />
          </Box>
          <Box p={2}>
            <TextField
              fullWidth
              InputProps={{
                inputComponent: CustomLocation,
              }}
              sx={[
                { input: { color: "white" } },
                {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "lightgray",
                    },
                    "&:hover fieldset": {
                      borderColor: "lightgray",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "lightgray",
                    },
                  },
                  "& label": {
                    color: "lightgray",
                  },
                  "& label.Mui-focused": {
                    color: "lightgray",
                  },
                  ".MuiFormHelperText-root": { color: "lightgray" },
                  ".MuiOutlinedInput-root.Mui-focused": {
                    borderColor: "lightgray",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    borderColor: "lightgray",
                  },
                  caretColor: "lightgray",
                },
              ]}
            />
          </Box>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEvent}
            >
              Add Event
            </Button>
          </DialogActions>
        </DialogContent>
      </BootstrapDialog>

      <Grid container spacing={4}>
        <Grid item xs={8}>
          <div className="calendar">
            <BigCalendar
              localizer={localizer}
              defaultDate={new Date()}
              defaultView="month"
              events={events}
              popup
              selectable={true}
              onSelectEvent={handleSelectEvent}
              style={{ height: "100vh" }}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          <EventsList
            events={events}
            setOpen={setOpen}
            onDeleteEvent={handleDeleteEvent}
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            onRegisterUser={handleRegisterUser}
            registeredUsers={registeredUsers}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Calendar;
