<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" name="cloud-ddd-cml" generation="1" functional="0" release="0" Id="01efa18b-bc61-421b-a3a9-bd820ec3545a" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="cloud-ddd-cmlGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="ProcessOrgChangeRole:HttpIn" protocol="tcp">
          <inToChannel>
            <lBChannelMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/LB:ProcessOrgChangeRole:HttpIn" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="ProcessOrgChangeRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/MapProcessOrgChangeRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:ProcessOrgChangeRole:HttpIn">
          <toPorts>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRole/HttpIn" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapProcessOrgChangeRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="ProcessOrgChangeRole" generation="1" functional="0" release="0" software="C:\data\git\cloud-ddd-cml\local_package.csx\roles\ProcessOrgChangeRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="HttpIn" protocol="tcp" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;ProcessOrgChangeRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;ProcessOrgChangeRole&quot;&gt;&lt;e name=&quot;HttpIn&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="ProcessOrgChangeRoleUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="ProcessOrgChangeRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="ProcessOrgChangeRoleInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="fdb8f975-7c0b-41e0-a3a9-e93f3bfd22dc" ref="Microsoft.RedDog.Contract\ServiceContract\cloud-ddd-cmlContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="1ebd3558-fd0c-4075-b30d-6a6de6dea79f" ref="Microsoft.RedDog.Contract\Interface\ProcessOrgChangeRole:HttpIn@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/cloud-ddd-cml/cloud-ddd-cmlGroup/ProcessOrgChangeRole:HttpIn" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>