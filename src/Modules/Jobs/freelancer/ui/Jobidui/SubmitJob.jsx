import { Button } from "@/components/ui/button"
import { useJobStore } from "@/Hook/jobstore"
import { getContract } from "@/Hook/useContract"

export const SubmitJob = ()=>{
    const { currentJobid } = useJobStore()
    const RaiseDispute = async () => {
        const isConfirmed = window.confirm("Are you sure you want to raise a dispute?");
        if (isConfirmed) {
          const contract = await getContract()
          const tx = await contract.raiseDispute(currentJobid);
          await tx.wait();
          console.log("Dispute raised.");
        }
      };
    return (
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto mt-4 justify-center">
        <Button variant="destructive" size="maxi" className="w-full" onClick={RaiseDispute} >
        Dispute
        </Button>
        </div>
    )
}