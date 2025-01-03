import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createTask = asyncHandler(async function create(req, res, next) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access!");
  }
  const { title, status, deadline, priority, description, customField } =
    req.body;
  if (!title || !status) {
    throw new ApiError(400, "Title/Status should not be empty");
  }
  const task = await Task.create({
    title,
    status,
    deadline,
    priority,
    description,
    createdBy: user._id,
  });
  if (!task) {
    throw new ApiError(500, "Something went wrong while creating task");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Task created successfully", task));
});

export const getAllTasks = asyncHandler(async function getTask(req, res, next) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access!");
  }
  const tasks = await Task.find({ createdBy: user._id });
  if (!tasks) {
    throw new ApiError(500, "Something went wrong while fetching tasks");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "Task fetched successfully", tasks));
});

export const deleteTask = asyncHandler(async function delte(req, res, next) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access!");
  }
  const { id } = req.body;
  const deleteTask = await Task.findByIdAndDelete({ _id: id });
  if (!deleteTask) {
    throw new ApiError(500, "Something went wrong while deleting the task");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "Task deleted successfully", deleteTask));
});

export const updateTask = asyncHandler(async function update(req, res, next) {
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized access!");
  }
  const { id, title, status, deadline, priority, description, customField } =
    req.body;
  const updateTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      status,
      deadline,
      priority,
      description,
    },
    { new: true }
  );
  if (!updateTask) {
    throw new ApiError(500, "Something went wrong while updating the task");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, "Task updated successfully", updateTask));
});
