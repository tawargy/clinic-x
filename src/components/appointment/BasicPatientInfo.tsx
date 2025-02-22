interface IPatentInfo {
  name: string;
  dob: string;
  gender: string;
  occupation: string;
  residence: string;
  bornCity: string;
  Tel: string;
  email: string;
  married: string;
  smoker: string;
  SI: string;
  specialhabits: string;
}
function BasicPatientInfo({ patientInfo }: { patientInfo: IPatentInfo }) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <div className=" flex gap-4">
          <span>Name: {patientInfo.name}</span>
          <span>Gender: {patientInfo.gender}</span>
          <span>DOB: {patientInfo.dob}</span>
        </div>
        <div className="flex gap-4">
          <span>Born City: {patientInfo.bornCity}</span>
          <span>Occupation: {patientInfo.occupation}</span>
          <span>Residence: {patientInfo.residence}</span>
          <span>Married: {patientInfo.married}</span>
        </div>
        <div className="flex gap-4">
          <span>Smoker: {patientInfo.smoker}</span>
          <span>SI: {patientInfo.SI}</span>
          <span>Special Habits: {patientInfo.specialhabits}</span>
          <span>Tel: {patientInfo.Tel}</span>
        </div>
      </div>
    </div>
  );
}

export default BasicPatientInfo;
