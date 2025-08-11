export const createFeedbackItem = async (req: Request, res: Response) => {
    try {
        const { ...rest } = req.body;
        
        let processedItems: any[] = [];
        
        // Method 1: Try to parse nested formdata structure (item[0][name], item[0][message], etc.)
        const itemKeys = Object.keys(rest).filter(key => key.startsWith('item['));
        
        if (itemKeys.length > 0) {
            // Group by item index
            const itemGroups: { [key: string]: any } = {};
            itemKeys.forEach(key => {
                const match = key.match(/item\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const [, index, field] = match;
                    if (!itemGroups[index]) {
                        itemGroups[index] = { index: (parseInt(index) + 1).toString() };
                    }
                    itemGroups[index][field] = rest[key];
                }
            });
            
            // Convert to array and sort by index
            processedItems = Object.values(itemGroups).sort((a, b) => 
                parseInt(a.index) - parseInt(b.index)
            );
        } else {
            // Method 2: Try to parse as JSON string if it's a single field
            const itemField = rest.item;
            if (itemField) {
                try {
                    if (typeof itemField === 'string') {
                        processedItems = JSON.parse(itemField);
                    } else if (Array.isArray(itemField)) {
                        processedItems = itemField;
                    }
                } catch (e) {
                    console.log("Failed to parse item field as JSON:", e);
                }
            }
            
            // Method 3: Try to find individual item fields
            const individualItemKeys = Object.keys(rest).filter(key => 
                key.startsWith('name') || key.startsWith('message')
            );
            
            if (individualItemKeys.length > 0 && processedItems.length === 0) {
                // Create a single item from individual fields
                processedItems = [{
                    index: "1",
                    name: rest.name || "Anonymous",
                    message: rest.message || "",
                    images: []
                }];
            }
        }
        
        const files = req.files as Express.Multer.File[] | undefined;

        // Handle individual item images (item[0][image], item[1][image], etc.)
        if (files && files.length > 0) {
            files.forEach(file => {
                // Check if this is an item image field
                if (file.fieldname.startsWith('item[') && file.fieldname.endsWith('[image]')) {
                    const match = file.fieldname.match(/item\[(\d+)\]\[image\]/);
                    if (match) {
                        const itemIndex = parseInt(match[1]);
                        
                        // Add image to the corresponding item
                        if (processedItems[itemIndex]) {
                            processedItems[itemIndex].images = [file.path];
                        }
                    }
                }
            });
        }

        // Ensure all items have images array and proper structure
        processedItems = processedItems.map((item, index) => ({
            index: (index + 1).toString(),
            name: item.name || "Anonymous",
            message: item.message || "",
            images: item.images || []
        }));

        const feedbackSection = await FeedBackModel.create({
            item: processedItems
        });

        res.status(201).json({
            success: true,
            message: "Feedback section item created successfully.",
            data: feedbackSection
        });
    } catch (error: any) {
        console.error("Error creating Feedback item:", error.message);
        return res.status(400).json({
            success: false,
            message: "Invalid input data.",
            error: error.message,
        });
    };
};