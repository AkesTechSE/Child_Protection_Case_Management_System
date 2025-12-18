import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

const genders = ["male", "female", "other"];
const relationshipOptions = [
  'ወላጅ (Parent)',
  'የእንጀራ ወላጅ (Stepparent)',
  'አያት (Grandparent)',
  'ዘመድ (Relative)',
  'ሕጻን ጠባቂ/ሞግዚት (Babysitter)',
  'መምህር (Teacher)',
  'ጎረቤት (Neighbor)',
  'አሰሪ (Employer)',
  'እኩያ (Peer)',
  'እንግዳ/የማይታወቅ ሰው (Stranger)',
  'ሌላ (Other)'
];

const VictimForm = ({ initialData, cases = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    case_id: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    age: "",
    date_of_birth: "",
    contact_number: "",
    address: "",
    current_address: "",
    address_history: "",
    guardian_phone: "",
    guardian_email: "",
    relationship_to_perpetrator: "",
    description: "",
    additional_info: "",
  });

  useEffect(() => {
    if (initialData) {
      const normalizedRelationship = initialData.relationship_to_perpetrator
        ? relationshipOptions.find(
            (option) =>
              option.toLowerCase() ===
              initialData.relationship_to_perpetrator.toLowerCase()
          ) || initialData.relationship_to_perpetrator
        : "";

      setForm({
        ...initialData,
        date_of_birth: initialData.date_of_birth
          ? dayjs(initialData.date_of_birth).format("YYYY-MM-DD")
          : "",
        relationship_to_perpetrator: normalizedRelationship,
        additional_info:
          initialData.additional_info == null
            ? ""
            : typeof initialData.additional_info === "string"
              ? initialData.additional_info
              : JSON.stringify(initialData.additional_info, null, 2),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = () => {
    onSubmit(form);
  };

  return (
    <>
      <DialogTitle>
        {initialData ? "Update Victim" : "Create New Victim"}
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* CASE DROPDOWN */}
          <Grid item xs={12}>
            <TextField
              label="Case"
              name="case_id"
              select
              fullWidth
              value={form.case_id}
              onChange={handleChange}
              required
            >
                {(Array.isArray(cases) ? cases : []).map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {(c.case_number || `CASE-${c.id}`)} - {c.case_title || 'Untitled'}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>

          {/* FIRST NAME */}
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              name="first_name"
              fullWidth
              value={form.first_name}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* MIDDLE NAME */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Middle Name"
              name="middle_name"
              fullWidth
              value={form.middle_name}
              onChange={handleChange}
            />
          </Grid>

          {/* LAST NAME */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              name="last_name"
              fullWidth
              value={form.last_name}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* GENDER */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Gender"
              name="gender"
              select
              fullWidth
              value={form.gender}
              onChange={handleChange}
              required
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* AGE */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Age"
              name="age"
              type="number"
              fullWidth
              value={form.age}
              onChange={handleChange}
            />
          </Grid>

          {/* DOB */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Date of Birth"
              name="date_of_birth"
              type="date"
              fullWidth
              value={form.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* CONTACT NUMBER */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Contact Number"
              name="contact_number"
              fullWidth
              value={form.contact_number}
              onChange={handleChange}
            />
          </Grid>

          {/* ADDRESS */}
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={form.address}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* CURRENT ADDRESS */}
          <Grid item xs={12}>
            <TextField
              label="Current Address"
              name="current_address"
              fullWidth
              value={form.current_address}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* ADDRESS HISTORY */}
          <Grid item xs={12}>
            <TextField
              label="Address History"
              name="address_history"
              fullWidth
              value={form.address_history}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          {/* GUARDIAN PHONE */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Guardian Phone"
              name="guardian_phone"
              fullWidth
              value={form.guardian_phone}
              onChange={handleChange}
            />
          </Grid>

          {/* GUARDIAN EMAIL */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Guardian Email"
              name="guardian_email"
              fullWidth
              value={form.guardian_email}
              onChange={handleChange}
            />
          </Grid>

          {/* RELATIONSHIP */}
          <Grid item xs={12}>
            <TextField
              label="Relationship to Perpetrator"
              name="relationship_to_perpetrator"
              select
              fullWidth
              value={form.relationship_to_perpetrator}
              onChange={handleChange}
              helperText="Select how the victim is related to the perpetrator"
            >
              <MenuItem value="">Select relationship</MenuItem>
              {relationshipOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* DESCRIPTION */}
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          {/* ADDITIONAL INFO */}
          <Grid item xs={12}>
            <TextField
              label="Additional Info"
              name="additional_info"
              fullWidth
              multiline
              rows={3}
              value={form.additional_info}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={submitForm}>
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </>
  );
};

export default VictimForm;
