async function askTinyLlama(question) {
    const prompt = `
        You are an offline emergency assistant for disaster-prone areas in the Philippines.

        Rules:
        - Give short, practical, safe advice.
        - Prioritize immediate safety.
        - Do not invent phone numbers.
        - If unsure, tell the user to contact local authorities or responders if available.

        Question: ${question}
        Answer:
    `;

    const response = await fetch("http://127.0.0.1:8080/completion", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            prompt,
            n_predict: 120,
            temperature: 0.3,
            top_p: 0.9,
        }),
    });

    const data = await response.json();

    console.log(data.content || data);
}

askTinyLlama("What should I do during a flood?");