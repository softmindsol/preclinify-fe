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
  async ({ userId, moduleIds, limit }, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required.");
      }

      if (!moduleIds || moduleIds.length === 0) {
        return rejectWithValue("Module ID array is empty or not provided.");
      }

      // Step 1: Fetch only correct data from resultHistorySaq (keeping duplicates)
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("userId", userId)
        .eq("isCorrect", true)
        .in("moduleId", moduleIds);

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No correct records found in resultHistorySaq.");
      }

      // Extract all parentIds (with duplicates)
      const parentIds = resultHistory.map((item) => item.questionId);
      const childrenIds = resultHistory.map((item) => item.childrenId);

      console.log("Result History Children IDs (Preserving Duplicates):", childrenIds);

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found in resultHistorySaq.");
      }

      // Step 2: Fetch saqParent data while maintaining duplicates
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("id", parentIds);

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      // Extract categoryIds (keeping duplicates for proper mapping)
      const categoryIds = saqParentData.map((item) => item.categoryId);

      if (categoryIds.length === 0) {
        return rejectWithValue("No categoryIds found in saqParent.");
      }

      // Step 3: Fetch saqChild records for each childrenId (preserving duplicates)
      const childFetchPromises = childrenIds.map(async (childId) => {
        const { data, error } = await supabase
          .from("saqChild")
          .select("*")
          .eq("id", childId)
          .limit(1); // Fetch individually to maintain duplicate occurrences

        if (error) {
          throw new Error(`Error fetching saqChild data: ${error.message}`);
        }

        return data[0]; // Return single object to maintain structure
      });

      let saqChildData = await Promise.all(childFetchPromises);
      saqChildData = saqChildData.filter(Boolean); // Remove any null values

      // Step 4: Apply Limit if needed (while keeping duplicates)
      if (limit && limit < saqChildData.length) {
        saqChildData = saqChildData.slice(0, limit);
      }

      // Step 5: Group data into required structure while keeping duplicates
      const groupedData = saqParentData.map((parent) => {
        const children = saqChildData.filter(
          (child) => child.parentQuestionId === parent.id
        );

        return {
          categoryId: parent.categoryId,
          id: parent.id,
          parentQuestion: parent.parentQuestion,
          children, // Preserved duplicate child questions
        };
      });

      console.log("Correct Data (Duplicates Preserved):", groupedData);
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
  async ({ userId, moduleIds, limit }, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required.");
      }

      if (!moduleIds || moduleIds.length === 0) {
        return rejectWithValue("Module ID array is empty or not provided.");
      }
      // Step 1: Fetch only incorrect data from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("isIncorrect", true) // ✅ Fetch only incorrect answers
        .eq("moduleId", moduleIds)
        .eq('userId', userId)

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



export const fetchIncorrectUnAnsweredShortQuestionByModule = createAsyncThunk(
  "modules/fetchIncorrectUnAnsweredShortQuestionByModule",
  async ({ userId, moduleIds, limit }, { rejectWithValue }) => {
    try {

      if (!userId) {
        return rejectWithValue("User ID is required.");
      }

      if (!moduleIds || moduleIds.length === 0) {
        return rejectWithValue("Module ID array is empty or not provided.");
      }
      // Step 1: Fetch only incorrect data from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("isCorrect", true) // ✅ Fetch only incorrect answers
        .eq("moduleId", moduleIds)
        .eq('userId', userId)

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No incorrect records found in resultHistorySaq.");
      }

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
  async ({ userId, moduleIds, limit }, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required.");
      }

      if (!moduleIds || moduleIds.length === 0) {
        return rejectWithValue("Module ID array is empty or not provided.");
      }

      // ✅ Fetch both correct & incorrect answers
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId, isIncorrect, isCorrect")
        .eq("userId", userId)
        .in("moduleId", moduleIds)
        .or("isIncorrect.eq.true,isCorrect.eq.true");

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }

      if (!resultHistory || resultHistory.length === 0) {
        return rejectWithValue("No records found in resultHistorySaq.");
      }

      console.log("resultHistory:", resultHistory.length);

      // ✅ Preserve duplicates by NOT using Set
      const parentIds = resultHistory.map((item) => item.questionId);
      const resultHistoryIds = resultHistory.map((item) => item.childrenId);

      if (parentIds.length === 0) {
        return rejectWithValue("No parentIds found in resultHistorySaq.");
      }

      // ✅ Fetch data from saqParent
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("id", parentIds);

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      const categoryIds = saqParentData.map((item) => item.categoryId);

      if (categoryIds.length === 0) {
        return rejectWithValue("No categoryIds found in saqParent.");
      }

      // ✅ Fetch data from saqChild without removing duplicates
      let childQuery = supabase
        .from("saqChild")
        .select("*")
        .in("categoryId", categoryIds)
        .in("id", resultHistoryIds);

      if (limit) {
        childQuery = childQuery.limit(limit);
      }

      const { data: saqChildData, error: childError } = await childQuery;
      console.log("saqChildData:", saqChildData);

      if (childError) {
        throw new Error(`Error fetching saqChild data: ${childError.message}`);
      }

      // ✅ Preserve duplicates while grouping data
      const groupedData = resultHistory.map((record) => {
        const parent = saqParentData.find((p) => p.id === record.questionId);
        const children = saqChildData.filter((child) => child.id === record.childrenId);

        return {
          categoryId: parent?.categoryId || null,
          id: parent?.id || null,
          parentQuestion: parent?.parentQuestion || null,
          children: children, // Preserve duplicates
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



export const fetchFilteredCorrecUnAnsweredShortQuestions = createAsyncThunk(
  "modules/fetchFilteredCorrecUnAnsweredShortQuestions",
  async ({ userId, moduleIds, limit }, { rejectWithValue }) => {
    try {
      if (!userId) {
        return rejectWithValue("User ID is required.");
      }

      if (!moduleIds || moduleIds.length === 0) {
        return rejectWithValue("Module ID array is empty or not provided.");
      }

      // ✅ Step 1: Fetch incorrect & unanswered records from resultHistorySaq
      const { data: resultHistory, error: resultError } = await supabase
        .from("resultHistorySaq")
        .select("moduleId, questionId, childrenId")
        .eq("isIncorrect", true)
        .in("moduleId", moduleIds)
        .eq("userId", userId);

      if (resultError) {
        throw new Error(`Error fetching resultHistorySaq: ${resultError.message}`);
      }
      console.log("resultHistory:", resultHistory);

      // ✅ Extracting questionIds and childrenIds from resultHistorySaq
      const excludedParentIds = resultHistory.map((item) => item.questionId);
      const excludedChildIds = resultHistory.map((item) => item.childrenId);

      // ✅ Step 2: Fetch only those records from saqParent that are NOT in resultHistorySaq
      const { data: saqParentData, error: parentError } = await supabase
        .from("saqParent")
        .select("id, categoryId, parentQuestion")
        .in("categoryId", moduleIds)
        .not("id", "in", `(${excludedParentIds.join(",")})`); // ✅ Exclude resultHistorySaq parentIds

      if (parentError) {
        throw new Error(`Error fetching saqParent data: ${parentError.message}`);
      }

      console.log("saqParentData:", saqParentData)
      if (!saqParentData || saqParentData.length === 0) {
        return rejectWithValue("No matching saqParent records found.");
      }

      // ✅ Extracting categoryIds from saqParent
      const categoryIds = saqParentData.map((item) => item.categoryId);
      const parentIds = saqParentData.map((item) => item.id);

      // ✅ Step 3: Fetch only those saqChild records that belong to the filtered saqParent
      let childQuery = supabase
        .from("saqChild")
        .select("*")
        .in("categoryId", categoryIds)
        .in("parentQuestionId", parentIds)
        .not("id", "in", `(${excludedChildIds.join(",")})`); // ✅ Exclude resultHistorySaq childrenIds

      if (limit) {
        childQuery = childQuery.limit(limit);
      }

      const { data: saqChildData, error: childError } = await childQuery;

      if (childError) {
        throw new Error(`Error fetching saqChild data: ${childError.message}`);
      }

      // ✅ Step 4: Combine Parent & Child Data
      const combinedData = saqParentData.map((parent) => ({
        categoryId: parent.categoryId,
        id: parent.id,
        parentQuestion: parent.parentQuestion,
        children: saqChildData.filter((child) => child.parentQuestionId === parent.id),
      }));

      console.log("Filtered Data (excluding resultHistorySaq records):", combinedData);

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
