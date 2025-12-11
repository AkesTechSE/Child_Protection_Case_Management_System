import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import VictimList from "../components/Victims/VictimList";
import VictimForm from "../components/Victims/VictimForm";
import SearchBar from "../components/Common/SearchBar";
import { victimApi } from "../api/victims";
import { caseApi } from "../api/cases";

const VictimsPage = () => {
  const [victims, setVictims] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCases();
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await victimApi.getVictims({ search: searchTerm });
      setVictims(response.data || []);
    } catch (err) {
      console.error("Failed to fetch victims:", err);
      setError("Failed to load victims.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const response = await caseApi.getCases({ per_page: 100 });
      setCases(response.data || []);
    } catch (err) {
      console.error("Failed to fetch cases:", err);
      setError("Failed to load cases.");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchVictims();
  };

  const handleCreateVictim = async (data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        case_id: data.case_id,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        age: data.age,
        date_of_birth: data.date_of_birth,
        contact_number: data.contact_number,
        address: data.address,
        relationship_to_perpetrator: data.relationship_to_perpetrator,
        description: data.description,
        additional_info: data.additional_info || {},
      };

      await victimApi.createVictim(payload);
      setOpenForm(false);
      fetchVictims();
    } catch (err) {
      console.error("Failed to create victim:", err);
      setError("Failed to create victim.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVictim = async (id, data) => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        case_id: data.case_id,
        first_name: data.first_name,
        last_name: data.last_name,
        gender: data.gender,
        age: data.age,
        date_of_birth: data.date_of_birth,
        contact_number: data.contact_number,
        address: data.address,
        relationship_to_perpetrator: data.relationship_to_perpetrator,
        description: data.description,
        additional_info: data.additional_info || {},
      };

      await victimApi.updateVictim(id, payload);
      setSelectedVictim(null);
      setOpenForm(false);
      fetchVictims();
    } catch (err) {
      console.error("Failed to update victim:", err);
      setError("Failed to update victim.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVictim = async (id) => {
    if (!window.confirm("Are you sure you want to delete this victim?")) return;

    setLoading(true);
    try {
      await victimApi.deleteVictim(id);
      fetchVictims();
    } catch (err) {
      console.error("Failed to delete victim:", err);
      setError("Failed to delete victim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Victim Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          New Victim
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2, mb: 2 }}>
        <SearchBar onSearch={handleSearch} placeholder="Search victims..." />
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: "center", py: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <VictimList
            victims={victims}
            onEdit={(victim) => {
              setSelectedVictim(victim);
              setOpenForm(true);
            }}
            onDelete={handleDeleteVictim}
            onView={(v) => console.log("View victim:", v)}
          />
        )}
      </Paper>

      <Dialog
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedVictim(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <VictimForm
          initialData={selectedVictim}
          cases={cases}
          onSubmit={
            selectedVictim
              ? (data) => handleUpdateVictim(selectedVictim.id, data)
              : handleCreateVictim
          }
          onCancel={() => {
            setOpenForm(false);
            setSelectedVictim(null);
          }}
        />
      </Dialog>
    </Box>
  );
};

export default VictimsPage;
