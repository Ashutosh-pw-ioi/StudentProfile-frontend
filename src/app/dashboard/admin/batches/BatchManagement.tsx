"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus } from "lucide-react";
import Table from "../Table";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import Shimmer from "../Shimmer";
import ListModal from "./modals/ListModal";
import AddBatchModal from "./modals/AddBatchModal";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


interface Student {
  id: string;
  name: string;
  email: string;
  enrollmentNumber: string;
  batchId:string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
}

interface Batch {
  batchId: string;
  batchName: string;
  students: Student[];
  teachers: Teacher[];
  departmentName?: string;
  centerName?: string;
}

interface DepartmentBatches {
  departmentName: string;
  batches: Batch[];
}

interface BatchData {
  center: string;
  departments: DepartmentBatches[];
}

interface FullBatchData {
  success: boolean;
  data: BatchData;
}

interface TableBatch {
  id: string;
  name: string;
  department: string;
  center: string;
  students: number;
  teachers: string;
  studentsFull: Student[];
  teachersFull: Teacher[];
}

interface AdminData {
  id: string;
  name: string;
  email: string;
  center: {
    id: string;
    name: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function BatchManagement() {
  const [batches, setBatches] = useState<TableBatch[]>([]);
  const [batchesFull, setBatchesFull] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [listModalOpen, setListModalOpen] = useState(false);
  const [modalData, setModalData] = useState<Student[] | Teacher[]>([]);
  const [modalType, setModalType] = useState<"students" | "teachers">(
    "students"
  );
  const [modalTitle, setModalTitle] = useState("");

  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [userCenter, setUserCenter] = useState("");
  const [userRole, setUserRole] = useState("");
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      router.push("/auth/login/admin");
      return;
    }

    try {
      const userData: User = JSON.parse(user);
      if (userData.role === "ADMIN" && userData.id) {
        setAdminId(userData.id);
        setUserRole(userData.role);
      } else {
        throw new Error("Invalid user data");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push("/auth/login/admin");
    }
  }, [router]);

  const fetchAdminDetails = useCallback(async () => {
    if (!adminId) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post<{ success: boolean; data: AdminData }>(
        `${backendUrl}/api/admin/get`,
        { id: adminId },
        { headers: { token } }
      );

      if (response.data.success) {
        const adminData = response.data.data;
        setUserCenter(adminData.center.name);
      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
      }
    }
  }, [adminId, router]);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/auth/login/admin");
        return;
      }

      const config: any = {
        method: "GET",
        url: `${backendUrl}/api/batch/all`,
        headers: { token },
      };

      if (userRole === "SUPER_ADMIN" && userCenter) {
        config.method = "POST";
        config.data = { centerName: userCenter };
      }

      const response = await axios.request<FullBatchData>(config);

      if (!response.data.success) {
        throw new Error("API returned unsuccessful response");
      }

      const data = response.data;
      console.log(response.data);
      
      const allBatches: Batch[] = [];

      data.data.departments.forEach((department) => {
        department.batches.forEach((batch) => {
          allBatches.push({
            ...batch,
            departmentName: department.departmentName,
            centerName: data.data.center,
          });
        });
      });

      setBatchesFull(allBatches);
      console.log(allBatches);
      

      const transformedData: TableBatch[] = allBatches.map((batch) => (
        {
        id: batch.batchId,
        name: batch.batchName,
        department: batch.departmentName || "",
        center: batch.centerName || "",
        students: batch.students?.length || 0,
        teachers:
          batch.teachers?.length > 0
            ? batch.teachers.length.toString()
            : "No teachers",
        teachersFull: batch.teachers || [],
        studentsFull: batch.students || [],
      }));

      setBatches(transformedData);
    } catch (error) {
      console.error("Error fetching batches:", error);

      if (error instanceof AxiosError && error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        router.push("/auth/login/admin");
        return;
      }

      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : error instanceof Error
          ? error.message
          : "Failed to load batches";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [userCenter, userRole, router]);

  useEffect(() => {
    if (adminId) {
      fetchAdminDetails();
      fetchBatches();
    }
  }, [adminId, fetchAdminDetails, fetchBatches, refreshTrigger]);

  const handleUpdateBatch = (updatedItem: any) => {
    const batchItem = updatedItem as TableBatch;
    console.log(batchItem);
    

    const updateBatch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/admin");
          return;
        }
        console.log(batchItem);
        

        const updateData = {
          batchId: batchItem.id,
          batchName: batchItem.name,
        };

        console.log(updateData);
        

        const response = await axios.put(
          `${backendUrl}/api/batch/update`,
          updateData,
          { headers: { token } }
        );

        if (response.status === 200) {
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error updating batch:", error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/auth/login/admin");
          return;
        }

        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Failed to update batch";
        setError(errorMessage);
      }
    };

    updateBatch();
  };

  const handleDeleteBatch = (id: string | number) => {
    const deleteId = typeof id === "number" ? id.toString() : id;

    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    const deleteBatch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          router.push("/auth/login/admin");
          return;
        }

        const response = await axios.delete(
          `${backendUrl}/api/batch/delete`,
          {
            headers: { token },
            data: { batchId: deleteId },
          }
        );

        if (response.status === 200) {
          setRefreshTrigger((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error deleting batch:", error);

        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          router.push("/auth/login/admin");
          return;
        }

        const errorMessage =
          error instanceof AxiosError
            ? error.response?.data?.message || error.message
            : error instanceof Error
            ? error.message
            : "Failed to delete batch";
        setError(errorMessage);
      }
    };

    deleteBatch();
  };

  const openStudentsModal = (students: Student[]) => {
    setModalData(students);
    setModalType("students");
    setModalTitle("Students List");
    setListModalOpen(true);
  };

  const openTeachersModal = (teachers: Teacher[]) => {
    setModalData(teachers);
    setModalType("teachers");
    setModalTitle("Teachers List");
    setListModalOpen(true);
  };

  const closeModal = () => {
    setListModalOpen(false);
    setModalData([]);
  };

  const handleBatchCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOpenAddModal = () => {
    setIsAddBatchModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddBatchModalOpen(false);
  };

  if (loading) {
    return <Shimmer />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-2xl mx-auto mt-8">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            setRefreshTrigger((prev) => prev + 1);
          }}
          className="mt-2 px-4 py-2 bg-[#1B3A6A] text-white rounded-lg hover:bg-[#122A4E]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <ListModal
          isOpen={listModalOpen}
          onClose={closeModal}
          title={modalTitle}
          data={modalData}
          type={modalType}
        />

        <AddBatchModal
          isOpen={isAddBatchModalOpen}
          onClose={handleCloseAddModal}
          userCenter={userCenter}
          onBatchCreated={handleBatchCreated}
        />

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Batch Management
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-lg">
          <div className="p-6 text-center">
            <Users className="w-8 h-8 text-[#1B3A6A] mx-auto mb-2" />
            <h4 className="text-lg text-gray-600 mb-1">Total Batches</h4>
            <p className="text-5xl font-bold text-[#1B3A6A]">
              {batches.length}
            </p>
          </div>
        </div>

        <div className="bg-white/80 shadow-lg rounded-lg flex items-center justify-center p-6">
          <button
            onClick={handleOpenAddModal}
            className="flex flex-col items-center justify-center w-full h-full text-[#1B3A6A] hover:text-[#122A4E] transition-colors cursor-pointer"
          >
            <div className="bg-gray-200 rounded-full p-3 mb-2">
              <Plus size={24} />
            </div>
            <h3 className="text-lg font-semibold">Add New Batch</h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new batch record
            </p>
          </button>
        </div>
      </div>

      <Table
        data={batches}
        title="Batches Overview"
        filterField="department"
        badgeFields={["department"]}
        selectFields={{
          department: ["SOT", "SOM", "SOH"],
        }}
        nonEditableFields={["id", "center", "students", "teachers"]}
        onDelete={handleDeleteBatch}
        onEdit={handleUpdateBatch}
        hiddenColumns={["id", "teachersFull", "studentsFull"]}
        customRenderers={{
          teachers: (item) => (
            <button
              onClick={() => openTeachersModal(item.teachersFull)}
              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {item.teachers}
            </button>
          ),
          students: (item) => (
            <button
              onClick={() => openStudentsModal(item.studentsFull)}
              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {item.students} students
            </button>
          ),
        }}
      />
    </div>
  );
}
