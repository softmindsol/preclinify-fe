import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

// Fetch MCQs by moduleId with limit

export const fetchShortQuestionByModules = createAsyncThunk(
  "modules/fetchShortQuestionByModules",
  async (_, { rejectWithValue }) => {
    try {
      let query = supabase.from("saqParent").select("*");

      const { data, error } = await query;
      if (error) {
        throw new Error(`Error fetching data for moduleId  ${error.message}`);
      }

      const ids = data.map((item) => item.categoryId);

      return { ids, data }; // Return the fetched data
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  },
);

// export const fetchIncorrectCorrectShortQuestionByModules = createAsyncThunk(
//   "modules/fetchIncorrectCorrectShortQuestionByModules",
//   async (_, { rejectWithValue }) => {
//     try {
//       // Step 1: Fetch data from resultHistorySaq
//       const { data: resultHistory, error: resultError } = await supabase
//         .from("resultHistorySaq")
//         .select("moduleId, parentId");

//       if (resultError) {
//         throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
//       }

//       if (!resultHistory || resultHistory.length === 0) {
//         return rejectWithValue("No records found in resultHistorySaq.");
//       }

//       // Extract unique parentIds
//       const parentIds = [...new Set(resultHistory.map((item) => item.parentId))];

//       if (parentIds.length === 0) {
//         return rejectWithValue("No parentIds found in resultHistorySaq.");
//       }

//       // Step 2: Fetch data from saqParent based on parentId
//       const { data: saqParentData, error: parentError } = await supabase
//         .from("saqParent")
//         .select("id, categoryId, parentQuestion")
//         .in("id", parentIds);

//       if (parentError) {
//         throw new Error(`Error fetching saqParent data: ${parentError.message}`);
//       }

//       // Extract categoryIds from saqParent data
//       const categoryIds = [...new Set(saqParentData.map((item) => item.categoryId))];

//       if (categoryIds.length === 0) {
//         return rejectWithValue("No categoryIds found in saqParent.");
//       }

//       // Step 3: Fetch data from saqChild based on categoryId and parentQuestionId
//       const { data: saqChildData, error: childError } = await supabase
//         .from("saqChild")
//         .select("*")
//         .in("categoryId", categoryIds)
//         .in("parentQuestionId", parentIds);

//       if (childError) {
//         throw new Error(`Error fetching saqChild data: ${childError.message}`);
//       }

//       // Step 4: Group data into required structure
//       const groupedData = saqParentData.map((parent) => {
//         const children = saqChildData.filter((child) => child.parentQuestionId === parent.id);

//         return {
//           categoryId: parent.categoryId,
//           id: parent.id,
//           parentQuestion: parent.parentQuestion,
//           children: children, // Array of child questions related to this parent
//         };
//       });
//       console.log("groupedData:", groupedData);

//       return groupedData;
//     } catch (error) {
//       return rejectWithValue({
//         message: error?.message || "An unexpected error occurred",
//         stack: error?.stack,
//       });
//     }
//   }
// );

export const fetchCorrectShortQuestionByModules = createAsyncThunk(
  "modules/fetchCorrectShortQuestionByModules",
  async ({ moduleIds, limit }, { rejectWithValue }) => {
    try {
      // Step 1: Fetch only correct data from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("isCorrect", true) // ✅ Fetch only correct answers
        .eq("moduleId", moduleIds);

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No correct records found in resultHistorySaq.");
      }

      // Extract unique parentIds and ids
      const parentIds = [...new Set(resultHistory.map((item) => item.questionId))];
      const resultHistoryIds = [...new Set(resultHistory.map((item) => item.childrenId))];
      console.log("resultHistoryIds:", resultHistoryIds);

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found in resultHistorySaq.");
      }

      // Step 2: Fetch data from saqParent based on parentId
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("id", parentIds);

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      // Extract categoryIds from saqParent data
      const categoryIds = [...new Set(saqParentData.map((item) => item.categoryId))];

      if (categoryIds.length === 0) {
        return rejectWithValue("No categoryIds found in saqParent.");
      }

      // Step 3: Fetch saqChild records based on categoryId, parentQuestionId, and resultHistoryIds
      let childQuery = supabase
        .from("saqChild")
        .select("*")
        .in("categoryId", categoryIds)
        .in("parentQuestionId", parentIds)
        .in("id", resultHistoryIds); // Filter by correct resultHistoryIds

      if (limit) {
        childQuery = childQuery.limit(limit); // ✅ Applying limit on saqChild
      }

      const { data: saqChildData, error: childError } = await childQuery;

      if (childError) {
        throw new Error(`Error fetching saqChild data: ${childError.message}`);
      }

      // Step 4: Group data into required structure
      const groupedData = saqParentData.map((parent) => {
        const children = saqChildData.filter(
          (child) => child.parentQuestionId === parent.id
        );

        return {
          categoryId: parent.categoryId,
          id: parent.id,
          parentQuestion: parent.parentQuestion,
          children: children, // Array of correct child questions related to this parent
        };
      });

      console.log("Correct Data:", groupedData);

      return groupedData;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  }
);


export const fetchInCorrectShortQuestionByModules = createAsyncThunk(
  "modules/fetchInCorrectShortQuestionByModules",
  async ({ moduleIds, limit }, { rejectWithValue }) => {
    try {
      // Step 1: Fetch only incorrect data from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("isIncorrect", true) // ✅ Fetch only incorrect answers
        .eq("moduleId", moduleIds);

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No incorrect records found in resultHistorySaq.");
      }

      // Extract unique parentIds and ids
      const parentIds = [...new Set(resultHistory.map((item) => item.questionId))];
      const resultHistoryIds = [...new Set(resultHistory.map((item) => item.childrenId))];
      console.log("resultHistoryIds:", resultHistoryIds);

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found in resultHistorySaq.");
      }

      // Step 2: Fetch data from saqParent based on parentId
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("id", parentIds);

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      // Extract categoryIds from saqParent data
      const categoryIds = [...new Set(saqParentData.map((item) => item.categoryId))];

      if (categoryIds.length === 0) {
        return rejectWithValue("No categoryIds found in saqParent.");
      }

      // Step 3: Fetch saqChild records based on categoryId, parentQuestionId, and resultHistoryIds
      let childQuery = supabase
        .from("saqChild")
        .select("*")
        .in("categoryId", categoryIds)
        .in("parentQuestionId", parentIds)
        .in("id", resultHistoryIds); // Filter by incorrect resultHistoryIds

      if (limit) {
        childQuery = childQuery.limit(limit); // ✅ Applying limit on saqChild
      }

      const { data: saqChildData, error: childError } = await childQuery;

      if (childError) {
        throw new Error(`Error fetching saqChild data: ${childError.message}`);
      }

      // Step 4: Group data into required structure
      const groupedData = saqParentData.map((parent) => {
        const children = saqChildData.filter(
          (child) => child.parentQuestionId === parent.id
        );

        return {
          categoryId: parent.categoryId,
          id: parent.id,
          parentQuestion: parent.parentQuestion,
          children: children, // Array of incorrect child questions related to this parent
        };
      });

      console.log("Incorrect Data:", groupedData);

      return groupedData;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  }
);



export const fetchIncorrectCorrectShortQuestionByModules = createAsyncThunk(
  "modules/fetchIncorrectCorrectShortQuestionByModules",
  async ({ moduleIds, limit }, { rejectWithValue }) => {
    try {
      // Step 1: Fetch data from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId") // Including id
        .eq("moduleId", moduleIds);

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No records found in resultHistorySaq.");
      }

      // Extract unique parentIds and ids
      const parentIds = [...new Set(resultHistory.map((item) => item.questionId))];
      const resultHistoryIds = [...new Set(resultHistory.map((item) => item.childrenId))];
      console.log("resultHistoryIds:", resultHistoryIds);

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found in resultHistorySaq.");
      }

      // Step 2: Fetch data from saqParent based on parentId
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("id", parentIds);

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      // Extract categoryIds from saqParent data
      const categoryIds = [...new Set(saqParentData.map((item) => item.categoryId))];

      if (categoryIds.length === 0) {
        return rejectWithValue("No categoryIds found in saqParent.");
      }

      // Step 3: Fetch data from saqChild based on categoryId, parentQuestionId, and resultHistoryIds
      let childQuery = supabase
        .from("saqChild")
        .select("*") // Selecting required fields
        .in("categoryId", categoryIds)
        .in("parentQuestionId", parentIds)
        .in("id", resultHistoryIds); // Filter by resultHistoryIds

      if (limit) {
        childQuery = childQuery.limit(limit); // ✅ Applying limit on saqChild
      }

      const { data: saqChildData, error: childError } = await childQuery;

      if (childError) {
        throw new Error(`Error fetching saqChild data: ${childError.message}`);
      }

      // Step 4: Group data into required structure
      const groupedData = saqParentData.map((parent) => {
        const children = saqChildData.filter(
          (child) => child.parentQuestionId === parent.id
        );

        return {
          categoryId: parent.categoryId,
          id: parent.id,
          parentQuestion: parent.parentQuestion,
          children: children, // Array of child questions related to this parent
        };
      });

      console.log("CorrectIncorrect:", groupedData);

      return groupedData;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  }
);


export const fetchShortQuestionsWithChildren = createAsyncThunk(
  "modules/fetchShortQuestionsWithChildren",
  async ({ moduleIds, limit }, { rejectWithValue }) => {
    try {

      // Step 1: Fetch saqParent based on moduleIds with limit
      let parentQuery = supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion") // Selecting specific fields
        .in("categoryId", moduleIds);

      if (limit) {
        parentQuery = parentQuery.limit(limit); // ✅ Limit only on saqParent
      }

      const { data: saqParentData, error: parentError } = await parentQuery;

      if (parentError) {
        throw new Error(`Error fetching saqParent: ${parentError.message}`);
      }

      if (!saqParentData || saqParentData.length === 0) {
        return rejectWithValue("No records found in saqParent.");
      }


      // Extract parentIds and categoryIds from saqParent
      const parentIds = saqParentData.map((parent) => parent.id);
      const categoryIds = [...new Set(saqParentData.map((parent) => parent.categoryId))];

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found.");
      }

      // Step 2: Fetch all saqChild based on parentQuestionId (NO LIMIT)
      const { data: saqChildData, error: childError } = await supabase
        .from("saqChild")
        .select("*") // Selecting required fields
        .in("parentQuestionId", parentIds);

      if (childError) {
        throw new Error(`Error fetching saqChild: ${childError.message}`);
      }

      // Step 3: Combine Parent and Child Data
      const combinedData = saqParentData.map((parent) => ({
        categoryId: parent.categoryId,
        id: parent.id,
        parentQuestion: parent.parentQuestion,
        children: saqChildData.filter((child) => child.parentQuestionId === parent.id),
      }));

      console.log("All Data:", combinedData);

      return combinedData;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  }
);













export const fetchModulesById = createAsyncThunk(
  "modules/fetchSQAModules",
  async ({ ids }, { rejectWithValue }) => {
    try {
      // Fetch modules where the 'id' is in the provided 'ids' array
      const { data, error } = await supabase
        .from("modulesNew")
        .select("*")
        .in("categoryId", ids); // Filter modules based on the provided IDs

      // If there's an error in the response, reject it
      if (error) {
        return rejectWithValue(error.message);
      }

      return data; // Return the fetched modules
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchShortQuestionByModulesById = createAsyncThunk(
  "modules/fetchShortQuestionByModuleById",
  async ({ moduleIds }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("saqParent")
        .select("*")
        .in("categoryId", moduleIds); // 'in' method ka use

      if (error) {
        throw new Error(`Error fetching data for moduleId: ${error.message}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  },
);

export const fetchSqaChild = createAsyncThunk(
  "modules/fetchSqaChild",
  async ({ parentIds, limit }, { rejectWithValue }) => {
    try {
      if (!parentIds) return rejectWithValue("Invalid moduleId");

      const query = supabase
        .from("saqChild")
        .select("*")
        .in("parentQuestionId", parentIds);

      // Apply limit only if limit is provided
      if (limit) {
        query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        return rejectWithValue(
          error.message || "Failed to fetch module questions",
        );
      }

      return data;
    } catch (error) {
      return rejectWithValue(error?.message || "An unexpected error occurred");
    }
  },
);

export const fetchShortQuestionGroupByModulesById = createAsyncThunk(
  "modules/fetchShortQuestionGroupByModulesById",
  async (moduleIds, { rejectWithValue }) => {
    try {
      // Extract categoryId from the array of objects
      const categoryIds = moduleIds.map((module) => module.categoryId);

      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        throw new Error("No valid categoryId found in moduleIds.");
      }

      const { data, error } = await supabase
        .from("saqParent")
        .select("*")
        .in("categoryId", categoryIds); // Using extracted categoryIds array

      if (error) {
        throw new Error(`Error fetching data for moduleId: ${error.message}`);
      }

      return data;
    } catch (error) {
      return rejectWithValue({
        message: error?.message || "An unexpected error occurred",
        stack: error?.stack,
      });
    }
  },
);

export const fetchQuestionCounts = createAsyncThunk(
  "questions/fetchQuestionCounts",
  async () => {
    const { data, error } = await supabase
      .from("saqChild")
      .select("categoryId, questionLead");

    if (error) {
      throw new Error(error.message);
    }

    // Count questionLead by categoryId
    const counts = data.reduce((acc, item) => {
      const { categoryId } = item;
      if (!acc[categoryId]) {
        acc[categoryId] = 0;
      }
      acc[categoryId] += 1; // Increment count for each questionLead
      return acc;
    }, {});

    return counts;
  },
);
