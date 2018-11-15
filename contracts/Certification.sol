pragma solidity ^0.4.24;

contract Certification{
    
    struct Diploma{
        string name;//学历拥有者姓名
        uint age;//年龄
        bytes32 ID;//身份证号码
        string foreignCountry;//留学国家/地区
        string school;//留学学校
        uint year;//毕业年
        uint month;//毕业月
        string major;//所学专业
        address studentAddr;//该学生的地址
    }
    
    address[] students;//已注册的学生账户地址数组
    mapping (address=>Diploma) diploma;//根据学生地址查找他的学历
    
    //注册学生
    event NewStudent(address sender,bool isSuccess,string message);
    function newStudent(address _studentAddr) public {
        //判断是否已经注册
        if (!isStudentAlreadyRegister(_studentAddr)) {
            //还未注册
            diploma[_studentAddr].studentAddr = _studentAddr;
            students.push(_studentAddr);
            emit NewStudent(msg.sender, true, "注册成功");
            return;
        }
        else {
            emit NewStudent(msg.sender, false, "该地址已存在");
            return;
        }
    }
    
    //判断一个学生是否已经注册
    function isStudentAlreadyRegister(address _studentAddr) public returns (bool)  {
        for (uint i = 0; i < students.length; i++) {
            if (students[i] == _studentsAddr) {
                return true;
            }
        }
        return false;
    }

    //将学历信息保存至studentAddr对应的学生
    event SaveDiploma(address sender,bool isSuccess,string message);
    function saveDiploma(address _studentAddr,string _name,uint _age,byte32 _id,string _country,\
        string _school,uint _year,uint _month,string _major) public returns(bool){
        if(!isStudentAlreadyRegister(_studentAddr)){
            emit SaveDiploma(msg.sender, false, "学历导入失败");
            return false;
        }
        else{
            diploma[_studentAddr].name = _name;
            diploma[_studentAddr].age = _age;
            diploma[_studentAddr].id = _id;
            diploma[_studentAddr].foreignCountry = _country;
            diploma[_studentAddr].school = _school;
            diploma[_studentAddr].year = _year;
            diploma[_studentAddr].month = _month;
            diploma[_studentAddr].major = _major;
            emit SaveDiploma(msg.sender, false, "学历导入成功");
            return true;
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
    function getID(address _studentAddr) public returns(bytes32){
        return diploma[_studentAddr].ID;
    }
     //根据地址获取学生留学国家/地区
    function getName(address _studentAddr) public returns(string){
        return diploma[_studentAddr].foreignCountry;
    }
     //根据地址获取学生留学学校
    function getName(address _studentAddr) public returns(string){
        return diploma[_studentAddr].school;
    }
    //根据地址获取学生毕业年份
    function getName(address _studentAddr) public returns(uint){
        return diploma[_studentAddr].year;
    }
    //根据地址获取学生毕业月份
    function getName(address _studentAddr) public returns(uint){
        return diploma[_studentAddr].month;
    }
    //根据地址获取学生所学专业
    function getName(address _studentAddr) public returns(string){
        return diploma[_studentAddr].majors;
    }

}