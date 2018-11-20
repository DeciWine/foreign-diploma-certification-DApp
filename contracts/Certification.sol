pragma solidity ^0.4.24;

contract Certification{
    
    struct Diploma{
        string name;//学历拥有者姓名
        uint age;//年龄
        string ID;//身份证号码
        string foreignCountry;//留学国家/地区
        string school;//留学学校
        uint year;//毕业年
        uint month;//毕业月
        string major;//所学专业
        address studentAddr;//该学生的地址
    }
    
    address[] students;//已注册的学生账户地址数组
    mapping (address=>Diploma) public diploma;//根据学生地址查找他的学历
    
    //判断一个学生是否已经注册
    function isStudentAlreadyRegister(address _studentAddr) internal view returns (bool)  {
        for (uint i = 0; i < students.length; i++) {
            if (students[i] == _studentAddr) {
                return true;
            }
        }
        return false;
    }

    //注册学生
    event NewStudent(address sender,bool isSuccess,string message);
    function newStudent(address _studentAddr) internal  returns (bool) {
        //判断是否已经注册
        if (!isStudentAlreadyRegister(_studentAddr)) {
            //还未注册
            diploma[_studentAddr].studentAddr = _studentAddr;
            students.push(_studentAddr);
            emit NewStudent(msg.sender, true, "注册成功");
            return true;
        }
        else {
            emit NewStudent(msg.sender, false, "该地址已存在");
            return false;
        }
    }
    

    //将学历信息保存至studentAddr对应的学生
    event SaveDiploma(address sender,bool isSuccess,string message);
    function saveDiploma(address _studentAddr,string _name,uint _age,string _id,string _country,
        string _school,uint _year,uint _month,string _major) public  {
        if(!isStudentAlreadyRegister(_studentAddr)){
            if(newStudent(_studentAddr)){
                diploma[_studentAddr].name = _name;
                diploma[_studentAddr].age = _age;
                diploma[_studentAddr].ID = _id;
                diploma[_studentAddr].foreignCountry = _country;
                diploma[_studentAddr].school = _school;
                diploma[_studentAddr].year = _year;
                diploma[_studentAddr].month = _month;
                diploma[_studentAddr].major = _major;
                emit SaveDiploma(msg.sender, true, "学历导入成功");
            }else{
                emit SaveDiploma(msg.sender, false, "学历导入失败");
            }
            
            return;
        }
        else{
            emit SaveDiploma(msg.sender, false, "地址已经注册,学历导入失败");
        } 
    }
    
    //根据地址获取学生名字
    function getName(address _studentAddr) public returns(string){
        return diploma[_studentAddr].name;
    }
     //根据地址获取学生年龄
    function getAge(address _studentAddr) public returns(uint){
        return diploma[_studentAddr].age;
    }
     //根据地址获取学生身份证号码
    function getID(address _studentAddr) public returns(string){
        return diploma[_studentAddr].ID;
    }
     //根据地址获取学生留学国家/地区
    function getCountry(address _studentAddr) public returns(string){
        return diploma[_studentAddr].foreignCountry;
    }
     //根据地址获取学生留学学校
    function getSchool(address _studentAddr) public returns(string){
        return diploma[_studentAddr].school;
    }
    //根据地址获取学生毕业年份
    function getYear(address _studentAddr) public returns(uint){
        return diploma[_studentAddr].year;
    }
    //根据地址获取学生毕业月份
    function getMonth(address _studentAddr) public returns(uint){
        return diploma[_studentAddr].month;
    }
    //根据地址获取学生所学专业
    function getMajor(address _studentAddr) public returns(string){
        return diploma[_studentAddr].major;
    }

    //获取学历
//     event GetDiploma(address sender,bool isSuccess,string message);
//    function getDiploma(address _studentAddr) constant public returns(Diploma){
//        if(isStudentAlreadyRegister(_studentAddr)){

//        }else{
//            return 
//        }
//    }

    

}