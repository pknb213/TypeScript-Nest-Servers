# **회원 시스템 이벤트 기반 아키텍처 구축하기**

## **무엇을 이벤트로 발행할 것인가?**

MicroService Architecture (이하 MSA) 에서 Event Driven 이 함께 언급되는 이유는 무엇일까요?

MSA 핵심 키워드 중 `느슨한 결합`과 연관이 있습니다. 각 마이크로서비스는 서로 간 느슨한 결합을 가져감으로써 타 시스템에 대한 의존과 영향도를 줄이고 각 시스템의 목적에 집중함으로써 강한 응집을 갖는 시스템을 만들 수 있습니다. Event Driven 은 이를 돕습니다.

이해를 돕기 위하여 배달의민족의 회원과 가족계정이라는 두 가지 도메인의 관계를 예시로 들겠습니다.

“회원의 본인인증이 초기화되는 경우 가족계정 서비스에서 탈퇴되어야 한다" 라는 정책이 있습니다.

이를 코드로 작성하면 아래와 같습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-6.png

가족계정 서비스 탈퇴 로직은 회원의 본인인증 해제 로직에 깊게 관여되어 강한 결합을 가지고 있습니다.

마이크로서비스를 구성 함에 따라 두 도메인은 서로 다른 시스템으로 분리되어 회원 시스템, 가족계정 시스템이 되었습니다. 이 때 하나의 시스템에 존재하던 두 도메인의 물리적인 분리가 이루어집니다.

!https://techblog.woowahan.com/wp-content/uploads/2023/02/Untitled-7-family.png

물리적인 시스템의 분리로 인해 코드 레벨의 호출이 동기적인 HTTP 통신으로 변했습니다. 그러나 여전히 대상 도메인을 호출해야한다는 의도가 남아있기 때문에 물리적인 시스템 분리만으로는 결합이 느슨해졌다고 볼 수는 없습니다.

물리적인 의존을 제거하는 방법으로 쉽게 떠올릴 수 있는 것은 비동기 방식입니다. 대표적인 비동기 방식으로는 별도 스레드를 통한 HTTP 방식과 메시징 시스템을 이용한 방식이 있습니다.

주 흐름에서 분리된 별도 스레드를 통해 HTTP 요청을 합니다.

!https://techblog.woowahan.com/wp-content/uploads/2023/02/Familly-System-Untitled-8.png

별도 스레드에서 진행되기 때문에 주 흐름과 직접적인 결합이 제거될 수 있습니다. 그러나 시스템 관점에서는 여전히 별도 스레드에서 대상 도메인을 호출한다는 의도가 남아있기 때문에 이 또한 결합이 느슨해졌다고 볼 수 없습니다.

메시징 시스템을 이용하여 메시지를 전송합니다. 메시징 시스템을 사용하면서 느슨한 결합을 가져갈 수 있을 것이라고 기대하겠지만 메시징시스템을 사용하는 아키텍처가 항상 느슨한 결합을 보장하지는 않습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-9.png

회원의 본인인증 해제가 발생할 때 가족계정 탈퇴 메시지를 발송하였습니다. 메시지를 발송하는 것으로 물리적인 의존이 제거되었습니다. 그러나 결합은 느슨해지지 않습니다.

가족계정 탈퇴를 기대하는 메시지를 발행했기 때문에 가족계정 시스템의 정책이 변경될 때 회원 시스템의 메시지도 함께 변경되어야 합니다. 어떤 일을 해야 하는 지를 메시지 발행자가 알려주는 경우(Command), 해야하는 일이 변경될 때 메시지 발행자와 수신자 양쪽 모두의 코드가 변경돼야 하기 때문에 높은 결합도가 존재하게 됩니다.

또한 회원시스템은 여전히 가족계정의 비지니스를 알고 있는 논리적인 의존관계가 남아있기 때문에 결합이 느슨해졌다고 볼 수 없습니다. 물리적으로는 결합도가 높지 않지만 개념적으로는 결합도가 높은 상태인 것 입니다.

메시지를 발행하였음에도 의존관계가 남아있는 이유는 대상 도메인에게 기대하는 목적을 담은 메시지를 발행하였기 때문입니다. 메시징 시스템으로 보낸 메시지가 대상 도메인에게 기대하는 목적을 담았다면, 이것은 이벤트라 부르지 않습니다. 이것은 메시징 시스템을 이용한 비동기 요청일 뿐 입니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-10.png

회원의 본인인증 해제가 발생할 때 본인인증 해제 이벤트를 발송하였습니다. 회원시스템은 더 이상 가족계정 시스템의 정책을 알지 못합니다. 가족계정 시스템은 본인인증 해제 이벤트를 구독하여 가족계정 시스템의 비지니스를 구현합니다. 회원시스템은 가족계정 시스템의 비지니스 변경에 더 이상 영향을 받지 않습니다. 이로써 두 시스템 간의 결합이 느슨해졌습니다.

---

물리적인 시스템 분리부터 비동기 HTTP 통신, 이벤트 방식까지 살펴보며 의존 관계의 흐름을 살펴보았습니다.

메시징 시스템을 사용해 물리적인 의존을 제거할 수 있었지만, **메시지가 담는 의도에 따라 전혀 다른 결과**를 얻는다는 것을 알 수 있습니다.

**우리가 발행해야할 이벤트는 `도메인 이벤트로 인해 달성하려는 목적`이 아닌 `도메인 이벤트` 그 자체입니다.**

> 도메인이란 해결하고자 하는 문제 영역이며, 도메인 이벤트 는 문제 영역에서 발생할 수 있는 핵심 가치나 행위입니다. 도메인 이라는 용어로 Domain-Driven Design(이하 DDD) 과 관계를 지어 글을 보시는 분들이 계실 것 같아 DDD 와 큰 관련이 없음을 미리 명시합니다.
>
>
> 도메인의 핵심 가치나 행위를 정의하기 어렵다면 `이벤트 스토밍` 을 추천드립니다. `이벤트 스토밍` 은 DDD 의 전략적 설계 도구 중 하나이지만, 도메인 주도 설계를 위해서가 아니더라도 문제 영역 식별과 해결에 좋은 도구입니다.
>
> [도메인 지식 탐구를 위한 이벤트 스토밍 Event Storming](https://www.youtube.com/watch?v=hUcpv5fdCIk)
>

## **이벤트 발행과 구독**

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-11.png

회원시스템에서는 다양한 고민을 해결하기 위하여 3가지의 이벤트 종류와 3가지의 이벤트 구독자 계층을 정의하였습니다. 각 계층과 이벤트가 왜 만들어졌는지, 무엇을 해결해주는지 살펴보겠습니다.

### **어플리케이션 이벤트 & 첫번째 구독자 계층**

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-12.png

메시징 시스템을 사용하기 전 `Spring Framework` 의 `Application Event` 를 먼저 다루었습니다.

어플리케이션 이벤트를 먼저 다루는 이유는 이벤트를 통해 느슨한 결합을 만들어야 하는 일이 외부 세상에만 존재하는게 아니기 때문입니다.

스프링의 어플리케이션 이벤트는 분산-비동기를 다룰 수 있는 이벤트 버스를 제공하며, 트랜잭션을 제어할 수 있도록 지원합니다.

어플리케이션 이벤트를 구독하는 첫번째 구독자 계층은 스프링의 어플리케이션 이벤트가 제공하는 기능으로 한 어플리케이션 내에서 도메인 내부의 비관심사를 효율적으로 처리할 수 있습니다.

어플리케이션 내에서 반드시 해결해야만 하는 대표적인 도메인의 비관심사는 메시징 시스템으로 이벤트를 발행하는 것 입니다. 이벤트 구독은 발행 시스템에 영향 없이 자유롭게 확장이나 변경이 가능하므로, 우리는 도메인에 영향 없이 메시징 시스템에 대한 연결을 쉽게 작성하고 확장하고 변경할 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-13.png

또한 스프링 어플리케이션 이벤트를 통해 트랜잭션을 제어할 수 있습니다. 도메인에서 정의된 트랜잭션의 범위가 외부로부터 제어 될 수 있다는 것을 도메인에 대한 침해로 볼 수 있지만, 이 침해를 감수하는 대신 강력한 구독자를 만들 수 있습니다.

상태 변경을 야기하는 모든 도메인 행위는 메시징 시스템으로 전달해야한다는 시스템 정책을 세웠습니다. 이벤트를 메시징 시스템으로 전달하는 것은 도메인에게는 관심사가 아니지만 시스템에서는 중요한 정책입니다. 이런 경우 도메인 정책에 변경없이 트랜잭션을 확장하여 구독자의 행위를 트랜잭션 내에서 처리되도록 변경할 수 있습니다.

회원시스템은 메시징 시스템으로 `AWS SNS` 를 사용하고 있으므로, 첫번째 구독자 계층의 `SNS` 발행을 책임지는 이벤트 구독자가 만들어졌습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-39.png

```java
@Async(EVENT_HANDLER_TASK_EXECUTOR)
@TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
public void handleJoinEvent(MemberJoinApplicationEvent event) {
    MemberJoinEventPayload payload = MemberJoinEventPayload.from(event);
    notificationMessagingTemplate.sendNotification(clientNameProperties.getSns().getJoin(), payload, null);
}
```

그리고 이 구독자를 통해 발행되는 이벤트는 `내부 이벤트` 입니다.

### **내부 이벤트 & 두번째 구독자 계층**

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-14.png

어플리케이션 이벤트로 내부 이벤트를 처리할 수 있지만, 어플리케이션 이벤트 처리기는 어플리케이션의 리소스를 사용하기 때문에 도메인의 주요 기능 처리 성능에 영향을 미치게 됩니다. 또한 `Application Event` 가 잘 구현되어 있다지만, 메시지 유실과 장애 복구를 최소화해주는 메시징 시스템의 장점을 가져갈 수 없습니다.

첫번째 구독자 계층이 어플리케이션 내에서 해결해야하는 비관심사를 처리했다면, 내부 이벤트를 구독하는 두번째 구독자 계층은 이 외의 모든 도메인 내의 비관심사를 처리합니다.

### **비관심사 분리**

도메인 행위가 수행될 때 함께 수행되어야 하는 정책들이 있을 수 있습니다. 이러한 부가 정책들이 도메인의 주 행위인 것으로 착각될 수 있으며, 의존성 관계를 확장시키고 도메인의 주 행위에 대한 응집을 방해하게 됩니다.

도메인 내의 비관심사 분리의 예시로 로그인 프로세스를 살펴보겠습니다.

회원이 로그인을 할 때

- 회원을 로그인 상태로 변경
- “동일 계정 로그인 수 제한” 규칙에 따라 동일 계정이 로그인된 타 디바이스 로그아웃 처리
- 회원이 어느 디바이스에서 로그인되었는지 기록
- 동일 디바이스의 다른 계정 로그아웃 기록

을 해야 합니다.

```java
@Transactional
public void login(MemberNumber memberNumber, DeviceNumber deviceNumber) {
    devices.login(memberNumber, deviceNumber);
    devices.logoutMemberOtherDevices(memberNumber, deviceNumber);
    devices.logoutOtherMemberDevices(memberNumber, deviceNumber);
    member.login(memberNumber);
    applicationEventPublisher.publishEvent(MemberLoginApplicationEvent.from(memberNumber, deviceNumber));
}
```

이 코드를 살펴보았을 때 도메인의 주 행위가 무엇인지 알기 어렵습니다. 부가 정책들이 도메인 로직에 함께 작성되어 있기 때문입니다. 주요 기능을 찾고 비관심사를 분리하여 도메인 행위의 응집을 높이고 비관심사에 대한 결합을 느슨하게 만들어야 합니다. 도메인의 주요행위는 정책을 살펴보았을 때 알 수 있을 것 입니다. 정책마저 모호하다면 즉시 처리되어야 하는 것과 언젠가 처리되어야 하는 것을 분리함으로써 도메인의 주요 기능을 찾을 수 있습니다.

로그인 기능의 주 행위는 **“회원을 로그인 상태로 변경”** 하는 것 입니다. 이 외의 행위들은 로그인 행위에 부가적으로 붙어있는 정책들입니다. 부가적인 정책들을 도메인 로직에서 분리시킵니다.

```java
@Transactional
public void login(MemberNumber memberNumber, DeviceNumber deviceNumber) {
    member.login(memberNumber);
    applicationEventPublisher.publishEvent(MemberLoginApplicationEvent.from(memberNumber, deviceNumber));
}
```

또한 3가지 비관심사 작업이 서로 간의 의존이 없음을 알 수 있습니다. 우리는 `AWS SNS-SQS` 메시징 시스템을 통해 하나의 이벤트를 여러 구독으로 나누어서 처리할 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-15.png

```java
@SqsListener(value = "${sqs.login-device-login}", deletionPolicy = SqsMessageDeletionPolicy.ON_SUCCESS)
public void loginDevice(@Payload MemberLoginApplicationEvent payload) {
    devices.login(payload.getMemberNumber(), payload.getDeviceNumber());
}

@SqsListener(value = "${sqs.login-member-other-device-logout}", deletionPolicy = SqsMessageDeletionPolicy.ON_SUCCESS)
public void logoutMemberOtherDevices(@Payload MemberLoginApplicationEvent payload) {
    devices.logoutMemberOtherDevices(payload.getMemberNumber(), payload.getDeviceNumber());
}

@SqsListener(value = "${sqs.login-other-member-device-logout}", deletionPolicy = SqsMessageDeletionPolicy.ON_SUCCESS)
public void logoutOtherMemberDevices(@Payload MemberLoginApplicationEvent payload) {
    devices.logoutOtherMemberDevices(payload.getMemberNumber(), payload.getDeviceNumber());
}
```

이렇게 도메인 내의 비관심사를 분리함으로써 도메인 행위의 응집을 높이고, 비관심사에 대한 결합을 느슨하게 만들 수 있습니다. 또한 분리된 비관심사는 각자 구현이 되어 강한 응집과 높은 재사용성을 확보할 수 있습니다.

### **외부 이벤트 발행**

시스템 내의 비관심사를 분리했지만, MSA 를 위한 외부 시스템과의 관심사 분리를 위한 외부 이벤트 발행이 필요합니다. 외부 시스템에 이벤트를 전파하는 행위 또한 도메인 내에 존재하던 비관심사로 볼 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-30.png

```java
@SqsListener(value = "${sqs-join-broadcast}", deletionPolicy = SqsMessageDeletionPolicy.ON_SUCCESS)
public void handleBroadcast(@Payload MemberJoinApplicationEvent payload) {
    messageBroadcastExecutor.broadcast(MemberBroadcastMessage.from(payload));
}
```

다른 내부 이벤트 처리와 동일하게 두번째 구독자 계층의 `SNS 발행` 을 책임지는 이벤트 구독자로부터 `외부 이벤트` 가 발행되게 됩니다.

### **외부 이벤트 & 세번째 구독자 계층**

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-17.png

내부이벤트를 외부에서 구독하도록 할 수 있지만, 내부 이벤트와 외부 이벤트를 분리함으로써 내부에는 열린, 외부에는 닫힌 이벤트를 제공할 수 있다는 장점이 있습니다.

동일한 이벤트를 수신하더라도 각 구독자마다 서로 다른 목적을 가지고 있습니다. 이로인해 각 구독자는 이벤트를 인지하는 것 이상으로 데이터가 더 필요하게 될 수 있습니다.

### **열린 내부이벤트, 닫힌 외부이벤트**

**내부이벤트** 에는 구독자가 필요한 데이터를 페이로드에 제공하여 이벤트 처리의 효율을 챙길 수 있습니다. 이런 페이로드의 확장을 열어둘 수 있는 것은 이 이벤트가 내부 이벤트이기 때문입니다. **내부 이벤트는 시스템 내에 존재하기 때문에 이벤트의 발행이 구독자에게 미치는 영향을 파악하고 관리할 수 있습니다.** 또한 외부에 알릴 필요없는 내부의 개념을 이벤트에 녹일 수도 있습니다. 이러한 확장이 가능한 것 또한 내부 이벤트는 시스템 내에 존재하는 이벤트이기 때문입니다.

반면 외부 시스템 으로 전파되는 **외부이벤트**는 내부이벤트와는 다릅니다. 내부 이벤트는 도메인에 존재하는 비관심사를 분리하여 도메인의 응집도를 높이고 비관심사를 효율적으로 처리하는 것을 목적으로 하며, 외부 이벤트는 시스템과 시스템의 결합을 줄이는 것을 목적으로 합니다. 시스템 간의 결합을 느슨하게 만들기 위해 발행되는 **외부 이벤트는 이벤트 발행처에서 이벤트 구독자가 어떤 행위를 하는지 관심을 가지면 안되며, 관리할 수 없습니다**. 이벤트 발행처가 이벤트 구독자의 행위에 관심을 갖게 된다면 이는 또 다시 논리적인 의존 관계를 형성하게 되는 것 입니다.

외부시스템에서도 이벤트를 처리하기 위해 더 많은 정보가 필요할 것 입니다. 그러나 외부시스템의 비지니스에서 필요한 데이터를 페이로드에 추가하게 되면, 외부시스템의 비지니스 변화에 직접적인 의존 관계를 형성하게 될 것 입니다. 외부시스템과의 의존을 갖지 않는 이벤트를 만들기 위해 하나의 형태로 이벤트를 전달할 수 있는 **이벤트에 대한 일반화**가 필요합니다.

### **이벤트 일반화**

외부 시스템이 이벤트로 수행하려는 행위는 광범위하겠지만, 이벤트를 인지하는 과정은 쉽게 일반화할 수 있습니다.

**“언제, 어떤 회원이(식별자) 무엇을 하여(행위) 어떤 변화(변화 속성)가 발생했는가"**

`식별자`와 `행위`, `속성`, `이벤트 시간` 이 있다면 어떠한 시스템에서도 필요한 이벤트를 인지할 수 있음을 알 수 있습니다. 이를 페이로드로 구현하면 이벤트를 수신하는 측에서 필요한 이벤트를 분류하여 각 시스템에서 필요한 행위를 수행할 수 있습니다.

```java
public class ExternalEvent {
    private final String memberNumber;
    private final MemberEventType eventType;
    private final List<MemberEventAttributeType> attributeTypes;
    private final LocalDateTime eventDateTime;
}
```

외부 시스템들은 정해진 이벤트 형식 내에서 필요한 행위를 수행하면 되므로, 이벤트를 발행하는 시스템은 외부 시스템의 변화에 영향을 받지 않을 수 있습니다.

> TIP. SNS 속성을 이용하여 구독자들이 원하는 이벤트만 구독하기
>
>
> “AWS SNS” 의 속성을 기반으로 구독자마다 이벤트를 필터링할 수 있는 기능을 사용할 수 있습니다.
>
> https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
>
> 각 구독자는 필요한 이벤트 형식 혹은 속성 종류를 필터로 정의하여 어플리케이션에 필요한 이벤트만 유입되도록 만들 수도 있습니다. 필터링 기능을 통해 어플리케이션이 직접 이벤트를 분류해야하는 리소스 낭비를 줄일 수 있습니다.
>

### **ZERO-PAYLOAD 방식**

닫혀있는 외부이벤트의 부가 데이터를 전달하는 방식으로는 `ZERO-PAYLOAD` 방식을 선택했습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-36.png

`ZERO-PAYLOAD` 방식은 이벤트의 순서에 대한 보장 문제를 해소하는 방식으로 주로 소개되곤 하지만, 페이로드에 외부시스템에 대한 의존을 제거하여 느슨한 결합을 만들 수 있는 장점 또한 있습니다.

외부시스템은 일반화된 이벤트를 필터링하여 필요한 이벤트를 구독하고, 필요한 부가 정보는 API 를 통해 보장된 최신상태의 데이터를 사용할 수 있습니다.

---

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-18.png

**어플리케이션 이벤트를 통해 이벤트의 트랜잭션 제어를 할 수 있었으며, 내부 이벤트를 통해 내부의 비관심사를 효율적으로 분리할 수 있었으며, 외부 이벤트를 통해 외부시스템과 의존없는 이벤트를 발행하게 되었습니다.**

**이렇게 회원 시스템에 이벤트 기반의 아키텍처가 구축되었습니다.**

## **이벤트 저장소 구축**

이벤트의 계층을 분리하고, 메시징 시스템을 통해 안정적인 이벤트를 처리할 수 있게 되었지만 여전히 문제점들이 존재하고 있습니다.

### **첫번째 문제. 이벤트 발행에 대한 보장 유실**

`SNS-SQS-어플리케이션` 구간에서는 SQS의 정책을 통해 안정적인 실패 처리, 재시도 처리가 가능하지만 `어플리케이션-SNS` 구간에서는 HTTP 통신을 사용하므로 이벤트를 발행하는 과정에 문제가 발생할 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-31.png

내부 이벤트를 발행하는 과정을 트랜잭션 내부로 정의하면서, 메시징 시스템의 장애가 곧 시스템의 장애로 이어질 수 있습니다. 메시징 시스템의 장애가 시스템 장애로 이어지는 문제는 굉장히 큰 문제이므로 반드시 해결이 필요합니다.

```java
@Async(EVENT_HANDLER_TASK_EXECUTOR)
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handleJoinEvent(MemberJoinApplicationEvent event) {
    MemberJoinEventPayload payload = MemberJoinEventPayload.from(event);
    notificationMessagingTemplate.sendNotification(clientNameProperties.getSns().getJoin(), payload, null);
}
```

이 문제는 내부 이벤트 발행을 트랜잭션 이후로 정의를 하면서 해결할 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-32.png

그러나 트랜잭션 외부에서 처리되기 때문에 이벤트 발행에 대한 보장이 사라지게 되었습니다. `어플리케이션-SNS` 구간에서는 HTTP 통신을 사용하므로 네트워크 구간에서는 다양한 문제로 충분히 실패가 발생할 수 있습니다.

### **두번째 문제. 이벤트 재발행**

구독자들이 이벤트를 정상적으로 처리하더라도, 이벤트 처리를 잘못할 수 있기 때문에 언제든 이벤트를 재발행 해줄 수 있어야 합니다.

이 때 구독자들이 원하는 이벤트들의 형태는 자유롭습니다. 특정 이벤트, 특정 기간, 특정 회원이나, 특정 타입, 특정 속성 의 이벤트 발행을 원할 수 있습니다. 일부 메시징 시스템은 재발행에 대한 기능을 제공하지만, 모든 메시징 시스템이 이 기능을 제공하지 않으며 모든 요구사항을 수용하기도 힘듭니다.

대부분의 데이터는 최종 상태만을 보관하여 특정 시점의 상태를 복원하기 어려우며, 변경 내역을 가지고 있다고 하더라도 이벤트를 고려하지 않고 저장된 데이터로 이벤트를 복원하기는 쉽지 않습니다.

**이 두 가지 문제점을 해결하기 위해 우리는 이벤트 저장소를 구축하기로 하였습니다.**

### **이벤트 저장 시점**

메시징 시스템의 장애가 시스템의 장애로 이어지지 않도록 메시징 시스템으로 이벤트 발행을 별도 트랜잭션으로 정의를 하였습니다. 이는 “메시징 시스템으로 이벤트 발행을 도메인의 중요한 행위로 본다"는 정의를 깨버리는 것이었고, 이것이 이벤트 발행에 대한 보장을 사라지게 만들었습니다.

이 정의를 이벤트 저장소로 다시 복구를 하기 위해 우리는 “이벤트 저장소에 이벤트 저장하는 것을 도메인의 중요한 행위로 본다" 고 정의를 하였습니다. 모든 도메인 이벤트는 반드시 저장소에 저장되어야 하며, 저장소에 저장이 실패하게 되었을 때 도메인 행위도 실패했다고 간주한다는 리스크가 있지만, 어딘가에서는 반드시 데이터를 보장을 해야하기 때문에 이런 정의가 필요합니다.

```java
@EventListener
@Transactional
public void handleEvent(MemberJoinApplicationEvent event) {
    memberEventRecorder.record(event.toEventCommand());
}
```

이 정의를 통해 이벤트 저장소에 대한 저장을 트랜잭션 범위 내에서 처리하는 구독자를 만들었습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-21.png

### **저장소의 종류**

이벤트는 작은 단위로 저장이 되고, 고속 처리되어야하기 때문에 RDBMS 가 아닌 다른 데이터베이스를 선택해야한다고 생각할 수 있습니다.

도메인 저장소와 다른 종류의 데이터베이스를 사용할 경우 두 저장소에 대한 트랜잭션 처리를 할 수 있어야 합니다. 그러나 다종 데이터베이스의 분산 트랜잭션을 구현 하는 것은 굉장히 어려운 일 입니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-22.png

이벤트 저장소를 도메인 저장소와 동일한 저장소로 선택을 했을 경우 트랜잭션에 대한 처리는 DBMS 를 믿고 맡길 수 있으며, 인프라에 장애가 발생해도 트랜잭션을 통해 데이터 일관성을 보장할 수 있습니다.

동일 저장소를 통해 데이터베이스를 저장하고 이벤트를 발행함에 안정적인 정합성을 보장하는 방식은 [Transactional outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html) 이라고 소개되기도 합니다. 이 패턴의 핵심은 로컬 트랜잭션(동일 저장소를 사용한 트랜잭션)을 사용하여 데이터베이스를 저장하고 이벤트를 발행함에 정합성을 보장하는 내용입니다. 이벤트 저장소를 사용하기로 한 것이 이벤트 발행에 대한 보장 문제를 해결하기 위함이니 이 구현은 `Transactional outbox Pattern` 의 또다른 구현이라고 볼 수도 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-33.png

단일 저장소의 쓰기량 및 읽기량에 대한 성능적 리스크를 동반할 수 있겠지만, 이는 스케일업/아웃 혹은 샤딩을 하는 등 충분히 확장하여 대응 가능합니다.

그래서 이벤트 저장소로는 도메인 저장소와 동일한 저장소인 RDBMS 를 선택하게 되었습니다.

### **데이터의 형태**

### **이벤트 발행을 보장하기 위해 이벤트가 발행되었는지 확인할 수 있어야 한다.**

이벤트 발행에 대한 여부를 확인할 수 있도록 발행 여부 플래그가 필요했으며, 이벤트 자체에 대한 식별자가 필요했습니다.

```sql
create table member_event
(
    id            varchar(128) not null primary key,
    published     tinyint      not null,
    published_at  datetime     null,
    created_at    datetime     not null
);

create index ix_member_event_created_at_published
    on member_event (created_at, published);
```

### **특정 회원, 특정 행위, 특정 속성 변화, 특정 기간을 조회하여 재발행할 수 있어야 한다.**

다행히 이벤트 조회를 해결할 수 있는 일반화는 이미 진행되었었습니다. 바로 외부 이벤트 발행에서 입니다. “식별자”와 “행위”, “속성”, “이벤트 시간" 이 있다면 어떠한 시스템에서도 필요한 이벤트를 인지할 수 있다는 것을 알고 있습니다.

“식별자”와 “행위”, “속성”, “이벤트 시간" 를 정의하여 이벤트 조회를 해결합니다.

```sql
alter table member_event add member_number varchar(12) not null;
alter table member_event add event_type varchar(255) not null;
alter table member_event add attributes text not null;

create index ix_member_event_event_type_created_at
    on member_event (event_type, created_at);

create index ix_member_event_member_number
    on member_event (member_number);
```

하나의 행위에서 여러 속성이 변화될 수 있습니다. 속성을 풀어서 외래키를 갖는 별도 테이블로 작성할 수 있겠지만, 이벤트-속성에 대한 카디널러티는 다소 작기 때문에 속성을 JSON 형태로 보관하고 어플리케이션에서 필터링하도록 설계하였습니다.

- 회원 시스템은 이벤트 타입과 속성 타입의 N-M 관계를 정의하여 스팩 문서로 제공하고 있습니다.

  !https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-24.png


### **사용자 활동 추적**

정의된 이벤트를 다시 살펴보았을 때 이벤트 저장소가 회원에 대한 모든 활동과 변화를 추적할 수 있는 데이터가될 수 있다는 것을 알게 되었습니다. **우리가 정의한 이벤트는 구독자의 필요로 의해 만들어진 이벤트가 아닌, 이벤트 스토밍을 통해 회원에게 발생할 수 있는 모든 이벤트를 정의하였기 때문입니다.**

활동과 변화를 추적할 수 있는 데이터가 될 수 있도록 “수행 시스템", “수행 주체", “수행 사유" 를 추가로 기록하기로 했습니다. 또한 도메인의 상태 변화까지 추적할 수 있도록, 속성 타입 뿐만 아니라 속성 자체도 기록을 하기로 하였습니다.

```sql
alter table member_event add reason text not null;
alter table member_event add event_channel varchar(36) not null;
alter table member_event add requested_by varchar(36) not null;
```

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-37.png

**이렇게 문제 해결을 위한 저장소 스키마가 구성되었습니다.**

### **문제해결**

### **이벤트 발행 보장**

이벤트 발행에 대한 보장이 필요한 지점은 **내부 이벤트를 발행하는 과정** 이었습니다. 최초 이벤트를 기록할 때는 발행 여부를 `false`로 저장하고, 두번째 구독자 계층에 이벤트 발행 여부를 기록하는 구독자를 추가하여 데이터를 업데이트 처리하였습니다.

이 때 이벤트 발행 여부를 기록하는 구독자는 이벤트의 ID만 있다면 처리할 수 있습니다. 모든 이벤트의 `super class`를 정의하여 모든 이벤트가 이벤트 ID를 가지도록 만들었습니다.

```java
public abstract class EventPayload {
    private final String eventId;
}
```

구독자는 이벤트의 공통 페이로드를 사용하므로, 모든 `SNS`의 이벤트를 하나의 `Queue`를 통해 구독하여 처리할 수 있습니다.

```java
@SqsListener(value = "${sqs.event-publish-record}", deletionPolicy = SqsMessageDeletionPolicy.ON_SUCCESS)
public void recordEventPublish(@Payload EventPayload eventPayload) {
    eventPublishRecordCommand.record(eventPayload.getEventId());
}
```

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-34.png

**1) 도메인 이벤트가 발생할 때 `첫번째 계층의 이벤트 저장 구독자` 는 트랜잭션을 확장하여 도메인 행위와 함께 이벤트가 저장소에 저장되게 됩니다.**

**2) `첫번째 계층의 SNS 발행 구독자`는 `AFTER_COMMIT` 옵션으로 인해 도메인의 트랜잭션이 정상 처리되었을 때 SNS로 내부이벤트를 발행하게 됩니다.**

**3) `두번째 계층의 이벤트 발행 기록 구독자`는 내부이벤트를 수신하여 이벤트가 정상 발행되었음을 기록합니다.**

이제 내부 이벤트가 메시징 시스템으로 정상 발행되었다면 반드시 이벤트의 발행여부가 업데이트될 것 입니다.

우리는 이벤트 발행이 누락된 케이스를 사람이 감지하는 것이 아닌 시스템이 감지하여 자동으로 재발행할 수 있도록 배치 프로그램을 구성했습니다.

이 배치 프로그램은 이벤트 저장 시간을 기준으로 5분이 지나도 발행처리 되지 않은 이벤트를 SNS 에 재발행 합니다.

- 5분을 기준으로 한 이유는 `AWS SQS`의 재시도 처리가 최대 5분까지 진행될 수 있도록 설정을 해두었기 때문입니다.
- 이 배치 프로그램은 직접 이벤트의 상태를 변경하지 않습니다. 이벤트를 재발행하여 메시징 시스템에 정상적으로 전달이 된다면 이벤트 발행 처리 구독자에 의해 구독 처리가 될 것이기 때문입니다.

**4) 정상 발행되지 않은 이벤트는 `이벤트 발행 감지 배치` 를 통해 자동 재발행 처리됩니다.**

**이렇게 이벤트 저장소와 발행 처리 구독자, 배치 프로그램을 통해 메시지 발행이 보장되는 이벤트 시스템을 구축하였습니다.**

### **이벤트 재발행**

이벤트 저장소에 모든 이벤트가 남아있기 때문에 이벤트 저장소를 통해 모든 이벤트를 재발행할 수 있습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-38.png

이를 쉽게 처리할 수 있는 배치 프로그램을 구성했습니다.

`기간` `특정 행위` `특정 속성` `특정 회원` `특정 이벤트` 의 조건을 통해 `내부 이벤트` `외부 이벤트`를 선택하여 이벤트를 발행할 수 있도록 하였습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-41.png

> TIP. SNS 속성을 이용하여 특정 구독자 계층으로 이벤트 전송하기
>
>
> `AWS SNS` 의 속성을 기반으로 구독자마다 이벤트를 필터링할 수 있는 기능을 사용할 수 있습니다.
>
> https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
>
> 모든 SNS 속성에 “target” 이라는 속성을 정의하였습니다.
>
> 각 구독자에게 고유 ID 를 발급하고, `target` 에 대한 조건으로 `고유 ID`, `ALL` 을 정의합니다.
>
> `ALL` 은 모든 구독자에게 대한 공통 속성으로 모든 이벤트를 구독받게 하기 위함입니다.
>
> 평상시에는 `target` 속성에 `ALL` 타입을 사용하여 모든 구독자가 이벤트를 사용할 수 있도록 발급을 하며, 특정 구독자로 발행이 필요한 이벤트는 배치시스템에서 `고유 ID` 를 `target` 속성에 작성하여 발행하도록 합니다.
>
> 이 방법을 통해 특정 구독자로만 이벤트를 발행하는 메커니즘을 만들 수 있습니다.
>

### **기록 테이블 통합**

회원시스템은 개인정보를 처리하는 시스템으로 데이터 조회에 대한 많은 요구사항을 가지고 있습니다.

고객센터 인입 문제를 해결을 위해, 부정 사용자를 추적하기 위하여, 수사 기관의 협조를 하기 위하는 등 회원의 활동을 추적할 수 있어야 합니다. 그래서 회원시스템에는 이 요구사항을 수행하기 위한 수십개의 기록 테이블이 존재하였습니다.

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-40.png

이벤트 저장소를 구축함으로써 회원에 대한 모든 활동이 일관성있는 방식으로 저장되었고, 이로 인해 더 이상 별도 기록 테이블들이 필요하지 않게 되었습니다.

---

!https://techblog.woowahan.com/wp-content/uploads/2022/03/Untitled-35.png

이벤트 저장소까지 구축하며 회원시스템의 이벤트기반 아키텍처 만들기는 완료되었습니다.

## **마무리**

회원은 대부분의 시스템에 존재하는 도메인입니다. 어떤 시스템에나 존재하는 가장 평범한 도메인이기도 하지만, 동시에 모든 도메인이 회원을 의존하지 않을 수 없는 가장 중심적인 도메인이기도 합니다. 또한 개인정보를 집중적으로 다루고 있는 가장 치명적인 도메인이기도 합니다.

MSA 의 가장 중심에 위치한 회원 도메인이 외부 시스템에 의한 영향이 없기 위한, 외부 시스템에 영향을 주지 않기 위한, 회원의 개인정보를 안전하게 다루기 위한 고민 끝에 이러한 이벤트 기반의 아키텍처가 만들어졌습니다.

MSA 중심에서 가장 안정적인 시스템이기 위한 회원시스템의 고민은 계속되고 있습니다.