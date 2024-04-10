// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Ownable {
    address internal _owner;

    mapping(address => bool) public isAdmin;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    event AdminAdded(address indexed newAdmin);
    event AdminRemoved(address indexed admin);

    constructor() {
        address msgSender = msg.sender;
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function addAdmin(address _newAdmin)onlyOwner public {
        isAdmin[_newAdmin]=true;
        emit AdminAdded(_newAdmin);
    }

    function removeAdmin(address _admin) onlyOwner public  {
        isAdmin[_admin] = false;
        emit AdminRemoved(_admin);
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "!owner");
        _;
    }

     modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not an admin");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "new is 0");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract Creditcertification is Ownable{
    struct Credit{
        uint256 courserId;//课程id
        uint256 credits;//课程所得学分
        uint256 score;//课程成绩
        uint256 issueDate;//发布时间
        bool isModified; //标记是否被修改
        uint256 modifyNum;//修改次数
        bool isRevoked; // 新增字段，表示学分是否被撤销
        string issuingInstitution; // 授予学分的教育机构
        bool isTransferred;//是否被转出
        string targetInstitution; // 学分转移的目标机构
    }

    //转出记录
    struct CreditTransfer {
        address studentAddr;
        uint256 courseId;//课程id
        string targetInstitution;//转出的目标机构
        bool isApproved;//是否被允许转出
        bool isExecuted;//是否完成转让
        uint256 index;//索引
    }

    //课程信息
    struct CourserInfo{
        uint256 courserId;//课程id
        string courserName;//课程名字
        uint256 credits;//课程学分
        uint256 createTime;//课程创建时间
    }

    //第三方发起查询请求
    struct Request{
        address mechanism;
        uint256 expectNum; 
    }

    //第三方=》具体请求详情
    mapping (address =>Request[])public requestOfMechanism;

    //课程id=>课程info
    mapping (uint256=>CourserInfo)public courserInfo;

    //学生=》k课程编号=》学分数组
    mapping(address => mapping(uint => Credit)) public studentCredits;

    // 记录每个学生的课程ID
    mapping(address => uint[]) public studentCourseIds; 
    //是否是老师
    mapping(address=>bool)public teachers;

    mapping(uint256 => bool) public courseExists;

    //记录白名单
    mapping(address =>bool)public isWhiteList;

    uint256[]public  courseLists;

    //允许第三方查询次数
    mapping(address=>mapping(address=>uint256))public allowance;

    //学生发起的所有学分转移请求
    mapping(address => CreditTransfer[]) public creditTransferRequests;

    address[] public studentLists;

    


    modifier onlyTeacher() {
        require(teachers[msg.sender], "Not a teacher");
        _;
    }

    //注册时给用户钱包添加白名单
    function setWhiteList(address userAddr)external {
        isWhiteList[userAddr]=true;
    }

    //添加课程
    function addCourse(uint256 courseId,uint256 credits,string memory courseName)external onlyAdmin{
       
        require(!courseExists[courseId],"Course already exists");
        courseExists[courseId]=true;
        courseLists.push(courseId);
        courserInfo[courseId]=CourserInfo(
            courseId,
            courseName,
            credits,
            block.timestamp
        );
    }

    //查询课程详情
    function getCourseInfo(uint256 courseId)external returns(CourserInfo memory){
       
        require(courseExists[courseId]=true,"Course not exists");
        return courserInfo[courseId];
    }
    
    //添加老师
    function addTeacher(address teacher)external onlyAdmin{
       
        require(teacher!=address(0),"Invalid address");

        teachers[teacher]=true;
    }

    //移除老师
    function removeTeacher(address teacher)external onlyAdmin{
       
        require(teacher!=address(0),"Invalid address");
        require(teachers[teacher]==true,"address are not a teacher");
        teachers[teacher]=false;
    }

    //老师上传学分认证信息
    function recordCredit(address student,uint256 courserId,uint256 score,string memory issuingInstitution)public onlyTeacher{
       

        require(student!=address(0),"Invalid address");

        require(courserId>=0,"Invalid course ID");

        //require(credits>0,"Invalid credits");

        require(courseExists[courserId]==true,"course not exit");

        uint currentTimestamp = block.timestamp;

        uint newredits=courserInfo[courserId].credits;

        uint endCredits=score*newredits;

        studentCredits[student][courserId]=Credit(courserId, endCredits, score, currentTimestamp,false,0,false,issuingInstitution,false,"");

        studentCourseIds[student].push(courserId);
    }


    //获取所有课程id
    function getAllCourseID()external view returns(uint[] memory){

     

        return courseLists;
    }

    //学生查询自己的学分详情
    function getCreditsOfStudent() external view returns(Credit[] memory creditList) {
        

        uint length = studentCourseIds[msg.sender].length;

        creditList = new Credit[](length);

        for(uint i = 0; i < length; i++) {

            uint courseId = studentCourseIds[msg.sender][i];

            creditList[i] = studentCredits[msg.sender][courseId];
        }

        return creditList;
    }

    //学生授权第三方允许查询自己学分详情
    function approve(address spender,uint256 num )external returns(bool){
       
        allowance[msg.sender][spender]=num;
        
        return true;
    }

// 事件用于记录学生的学分详情
event LogCreditDetails(
    address indexed student,
    uint256 courseId,
    uint256 credits,
    uint256 score,
    uint256 issueDate,//发布时间
    bool isModified, //标记是否被修改
    uint256 modifyNum,//修改次数
    bool isRevoked,// 新增字段，表示学分是否被撤销
    string issuingInstitution, // 授予学分的教育机构
    bool isTransferred,//是否被转出
    string targetInstitution // 学分转移的目标机构
   
);

event Log(Credit[] indexed credit);
    //第三方查看某个学生学分详情
    function getStudentCreditByMechanism(address student)external  {
        
        require(allowance[student][msg.sender]>0,"you do not be allowed");
        allowance[student][msg.sender]--;
        uint length = studentCourseIds[student].length;

        Credit[]memory creditList = new Credit[](length);

        for(uint i = 0; i < length; i++) {

            uint courseId = studentCourseIds[student][i];

            creditList[i] = studentCredits[student][courseId];
            
            emit LogCreditDetails(student, creditList[i].courserId, creditList[i].credits, creditList[i].score,creditList[i].issueDate,creditList[i].isModified,creditList[i].modifyNum,creditList[i].isRevoked,creditList[i]. issuingInstitution,creditList[i].isTransferred,creditList[i].targetInstitution);
        }


    }

    //第三方申请查看某个学生学详情
    function Requests(address stuAddr,uint256 num)external {
       
        
        requestOfMechanism[stuAddr].push(Request({
            mechanism:msg.sender,
            expectNum:num
        }));
    }

    //获取所有的appreove的list
    function GetAllApproveList()external view returns(Request[]memory){
        return requestOfMechanism[msg.sender];
    }

    // 用于老师修改学分的函数
    function modifyCredit(address student, uint256 courseId,  uint256 newScore) external  onlyTeacher {
       

        require(studentCredits[student][courseId].issueDate != 0, "Credit does not exist");

        require(student!=address(0),"Invalid address");

        require(courseId>=0,"Invalid course ID");



        require(!studentCredits[student][courseId].isRevoked, "Credit already revoked");

        uint256 num=studentCredits[student][courseId].modifyNum+1;
        uint256 newCredits=newScore*courserInfo[courseId].credits;
        
        // 创建新的修改后的学分记录
        studentCredits[student][courseId].credits=newCredits;
        studentCredits[student][courseId].modifyNum=num;
        studentCredits[student][courseId].score=newScore;
        studentCredits[student][courseId].isModified=true;
    }


    //学分撤销 必须为管理员才能call
    function Cancel(address student,uint256 courseId)external  onlyAdmin{
        
        require(studentCredits[student][courseId].issueDate != 0, "Credit does not exist");
        require(courseId>=0,"Invalid course ID");
        require(!studentCredits[student][courseId].isRevoked, "Credit already revoked");
        studentCredits[student][courseId].isRevoked = true;
    }

     // 计算特定学生的特定课程 ID 出现的次数
    function countCourseIdOccurrences(address student) public view returns (uint256) {
       
        return creditTransferRequests[student].length;
    }

    //学生发起学分转移请求
    function requestCreditTransfer(uint256 courseId, string memory targetInstitution) external {
      
        require(studentCredits[msg.sender][courseId].issueDate != 0, "Credit does not exist");
        require(!studentCredits[msg.sender][courseId].isRevoked, "Credit already revoked");
        uint256 num=countCourseIdOccurrences(msg.sender);
        creditTransferRequests[msg.sender].push(CreditTransfer({
            studentAddr:msg.sender,
            courseId: courseId,
            targetInstitution: targetInstitution,
            isApproved: false,
            isExecuted: false,
            index:num
        }));
         // 检查此学生地址是否已在列表中
        bool isStudentExists = false;
        for (uint i = 0; i < studentLists.length; i++) {
            if (studentLists[i] == msg.sender) {
                isStudentExists = true;
                break;
            }
        }

        // 如果学生地址不存在于列表中，则添加
        if (!isStudentExists) {
            studentLists.push(msg.sender);
        }
}


    //管理员或授权教育机构审批学分转移请求
    function approveCreditTransfer(address student, uint index) external onlyAdmin {
        
        require(!creditTransferRequests[student][index].isApproved, "Transfer already approved");

        creditTransferRequests[student][index].isApproved = true;
}


    //执行已批准的学分转移
    function executeCreditTransfer(address student, uint index) external onlyAdmin{
       
        require(creditTransferRequests[student][index].isApproved, "Transfer not approved");

        require(!creditTransferRequests[student][index].isExecuted, "Transfer already executed");

        studentCredits[student][creditTransferRequests[student][index].courseId].targetInstitution=creditTransferRequests[student][index].targetInstitution;
        
        creditTransferRequests[student][index].isExecuted = true;

        studentCredits[student][creditTransferRequests[student][index].courseId].isTransferred=true;
}

    //查询转移学分记录
    function getCreditTransfersOfStudent(address student) external  view returns (CreditTransfer[] memory) {
       

        require(student != address(0), "Invalid student address");

        return creditTransferRequests[student];
}

 // 查询所有提交的学分转移记录
    function getAllrequestCreditTransfer() external view returns (CreditTransfer[] memory) {
       

        uint totalRequests = 0;

        // 首先，计算所有请求的总数
        for (uint i = 0; i < studentLists.length; i++) {
            totalRequests += creditTransferRequests[studentLists[i]].length;
        }

        // 创建足够大的数组来保存所有请求
        CreditTransfer[] memory allRequests = new CreditTransfer[](totalRequests);
        uint currentRequest = 0;

        // 填充返回数组
        for (uint i = 0; i < studentLists.length; i++) {
            for (uint j = 0; j < creditTransferRequests[studentLists[i]].length; j++) {
                allRequests[currentRequest] = creditTransferRequests[studentLists[i]][j];
                currentRequest++;
            }
        }

        return allRequests;
    }




}