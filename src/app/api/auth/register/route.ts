export async function POST(request: Request) {
  try {
    const req = await request.json();
    console.log(req);
  } catch (error) {
    console.log(error);
  }
}
