import { createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../config/helper";

export const fetchShortQuestionsWithChildrenFreeTrial = createAsyncThunk(
    "modules/fetchShortQuestionsWithChildrenFreeTrial",
    async ({ limit }, { rejectWithValue }) => {
        try {

            // Step 1: Fetch saqParent based on moduleIds with limit
            let parentQuery = supabase
                .from("saqParentFree")
                .select("id, categoryId, parentQuestion") // Selecting specific fields
               

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
                .from("saqChildFree")
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
            console.log("combinedData:", combinedData);


            return combinedData;
        } catch (error) {
            return rejectWithValue({
                message: error?.message || "An unexpected error occurred",
                stack: error?.stack,
            });
        }
    }
);