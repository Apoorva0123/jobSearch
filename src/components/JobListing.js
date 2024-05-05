import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setJobs } from "../redux/actions/jobActions";
import {
  Button,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const JobListing = () => {
  const [allJobs, setAllJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const jobs = useSelector((state) => state.allJobs.jobs);
  const dispatch = useDispatch();
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const body = JSON.stringify({
    limit: 10,
    offset: (page - 1) * 10,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body,
  };
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON",
        requestOptions
      );
      const result = await response.text();
      console.log("res:", JSON.parse(result).jdList);
      dispatch(setJobs(JSON.parse(result).jdList));
      setAllJobs(JSON.parse(result).jdList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    let clientHeight = document.documentElement.clientHeight;
    let scrollHeight = document.documentElement.scrollHeight;
    let scrollTop = document.documentElement.scrollTop;

    if (scrollHeight - clientHeight <= Math.ceil(scrollTop)) {
      setPage((prevPage) => prevPage + 1);
      fetchJobs();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const expFilter = (value) => {
    if (value == null || value == "") {
      fetchJobs();
      return;
    }
    let array = allJobs.filter((ele) => ele.minExp <= Number(value));
    dispatch(setJobs(array));
  };

  const payFilter = (value) => {
    if (value == null || value == "") {
      fetchJobs();
      return;
    }
    let array = allJobs.filter((ele) => ele.minJdSalary <= Number(value));
    dispatch(setJobs(array));
  };

  const roleFilter = (event) => {
    console.log("Value: ", event.target.value);
    let arr = allJobs.filter((ele) => ele.jobRole == event.target.value);
    dispatch(setJobs(arr));
  };

  return (
    <div>
      <div>
        <h3 style={{ marginLeft: "20px" }}>Filters</h3>
        <div style={{ display: "flex" }}>
          <TextField
            id="outlined-basic"
            label="Experience"
            variant="outlined"
            type="number"
            onChange={(event) => expFilter(event.target.value)}
          />
          <TextField
            id="outlined-basic"
            label="Min Base Pay"
            variant="outlined"
            type="number"
            onChange={(event) => payFilter(event.target.value)}
          />
          <Select
            placeholder="Role"
            variant="outlined"
            title="Role"
            onChange={roleFilter}
          >
            <MenuItem value="" disabled>
              Select Job Role
            </MenuItem>
            <MenuItem value={"frontend"}>Front-end</MenuItem>
            <MenuItem value={"tech lead"}>Tech lead</MenuItem>
            <MenuItem value={"android"}>Android</MenuItem>
            <MenuItem value={"ios"}>IOS</MenuItem>
            <MenuItem value={"backend"}>Backend</MenuItem>
          </Select>
        </div>
      </div>
      <Grid container spacing={4}>
        {jobs.map((ele, ind) => (
          <Grid key={ind} item xs={4} style={{ height: "400px" }}>
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                height: "95%",
                padding: "20px",
                borderRadius: "10px",
                textAlign: "left",
                overflowY: "scroll",
              }}
            >
              <div style={{ display: "flex" }}>
                <div>
                  <img style={{ height: "40px" }} src={ele.logoUrl} />
                </div>
                <div
                  style={{
                    marginTop: "-10px",
                    lineHeight: "2px",
                    padding: "0px 0px 0px 10px",
                  }}
                >
                  <h4 style={{ color: "grey" }}>{ele.companyName}</h4>
                  <p style={{ fontSize: "13px" }}>{ele.jobRole}</p>
                  <p style={{ fontSize: "13px" }}>{ele.location}</p>
                </div>
              </div>
              <h5 style={{ color: "grey" }}>
                Estimated Salary: {ele.salaryCurrencyCode}{" "}
                {ele.minJdSalary || 0}-{ele.maxJdSalary} LPA
              </h5>
              <h5 style={{ color: "grey" }}>Experience Required</h5>
              <p>
                {ele.minExp || 0} - {ele.maxExp || 0} Years
              </p>
              <Button
                variant="contained"
                style={{ backgroundColor: "rgb(7, 242, 242)", width: "95%" }}
              >
                Easy Apply
              </Button>
              <h4>About Company: </h4>
              <p>{ele.jobDetailsFromCompany}</p>
            </div>
          </Grid>
        ))}
      </Grid>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default JobListing;
