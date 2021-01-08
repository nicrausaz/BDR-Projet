import router from "@/router";

export async function RedirectError(error?: Error) {
  return await router.replace({
    name: "Error",
    params: {
      error: JSON.stringify(error)
    }
  });
}
