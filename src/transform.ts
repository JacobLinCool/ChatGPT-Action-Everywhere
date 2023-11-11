import html2md from "html-to-md";

export async function transform(url: URL, request: Request): Promise<Response> {
	let [, origin, ...paths] = url.pathname.split("/");
	origin = decodeURIComponent(origin);
	const path = paths.filter(Boolean).join("/");
	console.log({ origin, path });
	try {
		new URL(origin);
	} catch {
		return new Response("Invalid origin", { status: 400 });
	}

	const res =
		request.method.toUpperCase() === "GET"
			? await fetch(origin + "/" + path)
			: await fetch(origin + "/" + path, request);
	console.log(res.status, res.statusText);
	if (!res.ok) {
		return res;
	}

	const type = res.headers.get("Content-Type");
	if (type?.includes("json")) {
		return res;
	} else if (type?.includes("text/html")) {
		const html = await res.text();
		const content = html2md(html);
		const body = JSON.stringify({ content });
		return new Response(body, {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers,
		});
	} else {
		const content = await res.text();
		const body = JSON.stringify({ content });
		return new Response(body, {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers,
		});
	}
}
