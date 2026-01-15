import cron from "node-cron";
import { userRepository} from "../../modules/user/user.repository.ts";

export function initCronJobs() {
  cron.schedule("0 0 * * 0", async () => {
    console.log("Weekly clean up running!");
    
    try{
        const deletedCount = await userRepository.permanentlyDeleteSoftDeleted();
        console.log(`Successfully deleted ${deletedCount} soft-deleted users`);
    } catch (error) {
      console.error("Error during user cleanup:", error);
    }
  });

  console.log("Cron jobs initialized");
}
