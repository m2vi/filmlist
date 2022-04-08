export const ErrorResponse = (status: number, error: any) => {
  return new Response(JSON.stringify({ error }), { status });
};
